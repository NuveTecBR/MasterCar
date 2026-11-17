import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { get, query, run } from '../database/conexao.js';

export const oficinaService = {
  autenticar({ email, senha }) {
    const u = get('SELECT id, nome, email, senha_hash, cargo, criado_em FROM usuarios WHERE email = ?', [email]);
    if (!u || !bcrypt.compareSync(senha, u.senha_hash)) {
      const err = new Error('Credenciais inválidas.');
      err.statusCode = 401;
      throw err;
    }

    const usuario = { id: u.id, nome: u.nome, email: u.email, cargo: u.cargo, criado_em: u.criado_em };
    const token = jwt.sign(usuario, process.env.JWT_SECRET, { expiresIn: '7d' });
    return { token, usuario };
  },

  listarServicos(filtros = {}) {
    let sql = 'SELECT * FROM servicos WHERE 1=1';
    const params = [];

    if (filtros.categoria && filtros.categoria !== 'Todas') {
      sql += ' AND categoria = ?';
      params.push(String(filtros.categoria));
    }
    if (filtros.busca && String(filtros.busca).trim() !== '') {
      const t = `%${String(filtros.busca).trim()}%`;
      sql += ' AND (nome LIKE ? OR descricao LIKE ? OR inclui_itens LIKE ?)';
      params.push(t, t, t);
    }

    sql += ' ORDER BY destaque DESC, preco_base ASC';
    return query(sql, params);
  },

  calcularOrcamentoPreventivo({ servico_id, porte_veiculo }) {
    const servico = get('SELECT * FROM servicos WHERE id = ?', [Number(servico_id)]);
    if (!servico) {
      const err = new Error('Serviço não encontrado.');
      err.statusCode = 404;
      throw err;
    }

    const multiplicadorPorte = porte_veiculo === 'Picape / Diesel' ? 1.45 : (porte_veiculo === 'SUV / Utilitário' ? 1.22 : 1.0);
    const valorEstimado = Number((servico.preco_base * multiplicadorPorte).toFixed(2));

    return {
      servico: {
        id: servico.id,
        codigo: servico.codigo,
        nome: servico.nome,
        tempo_estimado: servico.tempo_estimado,
        garantia_meses: servico.garantia_meses
      },
      porte_veiculo,
      multiplicador_aplicado: multiplicadorPorte,
      valor_estimado: valorEstimado
    };
  },

  consultarOrdemPorPlacaOuProtocolo(termoRaw = '') {
    const limpo = String(termoRaw).trim().toUpperCase().replace(/[^A-Z0-9-]/g, '');
    if (limpo.length < 3) {
      const err = new Error('Digite a placa do veículo (ex: BRA2E19) ou o número da OS.');
      err.statusCode = 400;
      throw err;
    }

    const ordem = get(
      'SELECT * FROM ordens_servico WHERE UPPER(placa_veiculo) = ? OR UPPER(protocolo_os) = ?',
      [limpo.replace('-', ''), limpo]
    );

    if (!ordem) {
      const err = new Error(`Nenhuma Ordem de Serviço ativa encontrada para "${limpo}". Experimente as placas demonstrativas: BRA2E19, QXZ4G88 ou FSP9A12.`);
      err.statusCode = 404;
      throw err;
    }

    return ordem;
  },

  listarTodasOrdens() {
    return query('SELECT * FROM ordens_servico ORDER BY id ASC');
  },

  atualizarOrdem(id, { etapa_atual, progresso_pct, relatorio_tecnico }) {
    const atual = get('SELECT * FROM ordens_servico WHERE id = ?', [Number(id)]);
    if (!atual) {
      const err = new Error('Ordem de serviço não encontrada.');
      err.statusCode = 404;
      throw err;
    }
    const novoRelatorio = relatorio_tecnico || atual.relatorio_tecnico;
    run(
      `UPDATE ordens_servico
       SET etapa_atual = ?, progresso_pct = ?, relatorio_tecnico = ?, atualizado_em = datetime('now')
       WHERE id = ?`,
      [etapa_atual, progresso_pct, novoRelatorio, Number(id)]
    );
    return get('SELECT * FROM ordens_servico WHERE id = ?', [Number(id)]);
  },

  criarAgendamento(dados) {
    const orcamento = this.calcularOrcamentoPreventivo({
      servico_id: dados.servico_id,
      porte_veiculo: dados.porte_veiculo
    });

    const protocolo = `MTC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const res = run(
      `INSERT INTO agendamentos (
        protocolo, servico_id, tipo_solicitacao, nome_cliente, telefone,
        placa_veiculo, modelo_veiculo, porte_veiculo, valor_estimado,
        sintomas_relatados, consentimento_lgpd
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        protocolo,
        dados.servico_id,
        dados.tipo_solicitacao,
        dados.nome_cliente,
        dados.telefone,
        dados.placa_veiculo,
        dados.modelo_veiculo,
        dados.porte_veiculo,
        orcamento.valor_estimado,
        dados.sintomas_relatados,
        dados.consentimento_lgpd
      ]
    );

    const textoWhats = encodeURIComponent(
      `Olá MasterCar! Protocolo *${protocolo}* (${dados.tipo_solicitacao}).\n` +
      `• Serviço: ${orcamento.servico.nome}\n` +
      `• Veículo: ${dados.modelo_veiculo} (${dados.placa_veiculo}) — ${dados.porte_veiculo}\n` +
      `• Orçamento Prévio Estimado: R$ ${orcamento.valor_estimado.toLocaleString('pt-BR')}\n` +
      `• Cliente: ${dados.nome_cliente}`
    );

    return {
      id: res.lastInsertRowid,
      protocolo,
      orcamento,
      whatsapp_url: `https://wa.me/5511988881111?text=${textoWhats}`,
      mensagem: 'Pré-orçamento e solicitação de box registrados com sucesso!'
    };
  },

  listarAgendamentos() {
    return query(`
      SELECT a.*, s.nome AS servico_nome, s.codigo AS servico_codigo
      FROM agendamentos a
      JOIN servicos s ON s.id = a.servico_id
      ORDER BY a.id DESC
    `);
  },

  registrarLgpd(dados) {
    const protocolo = `LGPD-MTC-${Math.floor(10000 + Math.random() * 90000)}`;
    run(
      'INSERT INTO solicitacoes_lgpd (protocolo, nome_titular, email_titular, tipo_direito, detalhes) VALUES (?, ?, ?, ?, ?)',
      [protocolo, dados.nome_titular, dados.email_titular, dados.tipo_direito, dados.detalhes]
    );
    return {
      protocolo,
      status: 'Registrado junto ao DPO MasterCar',
      prazo_resposta: 'Até 15 dias conforme Art. 18 da LGPD.'
    };
  }
};
