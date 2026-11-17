function sanitizar(valor, maxLen = 400) {
  if (typeof valor !== 'string') return '';
  return valor.trim().replace(/[<>]/g, '').slice(0, maxLen);
}

export function validarLoginInput(body = {}) {
  const email = sanitizar(body.email, 120).toLowerCase();
  const senha = typeof body.senha === 'string' ? body.senha : '';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || senha.length < 6) {
    const err = new Error('Informe e-mail e senha válidos.');
    err.statusCode = 400;
    throw err;
  }
  return { email, senha };
}

export function validarOrcamentoInput(body = {}) {
  if (body.oficina_website_honeypot && String(body.oficina_website_honeypot).trim() !== '') {
    return { isBotHoneypot: true };
  }
  const servico_id = Number(body.servico_id);
  const porte_veiculo = ['Leve (Hatch/Sedan)', 'SUV / Utilitário', 'Picape / Diesel'].includes(body.porte_veiculo)
    ? body.porte_veiculo
    : 'Leve (Hatch/Sedan)';

  if (!Number.isInteger(servico_id) || servico_id <= 0) {
    const err = new Error('Selecione um serviço válido da tabela.');
    err.statusCode = 400;
    throw err;
  }
  return { servico_id, porte_veiculo };
}

export function validarAgendamentoInput(body = {}) {
  if (body.oficina_website_honeypot && String(body.oficina_website_honeypot).trim() !== '') {
    return { isBotHoneypot: true };
  }

  const { servico_id, porte_veiculo } = validarOrcamentoInput(body);
  const tipo_solicitacao = ['Agendamento Oficina', 'Socorro Guincho Urgente', 'Orçamento Preventivo'].includes(body.tipo_solicitacao)
    ? body.tipo_solicitacao
    : 'Agendamento Oficina';
  const nome_cliente = sanitizar(body.nome_cliente, 100);
  const telefone = sanitizar(body.telefone, 30);
  const placa_veiculo = sanitizar(body.placa_veiculo || 'SEM-PLACA', 12).toUpperCase().replace(/[^A-Z0-9-]/g, '');
  const modelo_veiculo = sanitizar(body.modelo_veiculo, 80);
  const sintomas_relatados = sanitizar(body.sintomas_relatados || '', 350);
  const consentimento_lgpd = body.consentimento_lgpd === true || body.consentimento_lgpd === 1;

  if (nome_cliente.length < 3) {
    const err = new Error('Informe seu nome completo (mínimo 3 caracteres).');
    err.statusCode = 400;
    throw err;
  }
  if (telefone.replace(/\D/g, '').length < 10) {
    const err = new Error('Informe um telefone/WhatsApp válido com DDD.');
    err.statusCode = 400;
    throw err;
  }
  if (modelo_veiculo.length < 2) {
    const err = new Error('Informe o modelo e ano do veículo.');
    err.statusCode = 400;
    throw err;
  }
  if (!consentimento_lgpd) {
    const err = new Error('É obrigatório aceitar o termo LGPD para registrar o agendamento.');
    err.statusCode = 400;
    throw err;
  }

  return {
    servico_id,
    tipo_solicitacao,
    nome_cliente,
    telefone,
    placa_veiculo: placa_veiculo || 'A-DEFINIR',
    modelo_veiculo,
    porte_veiculo,
    sintomas_relatados,
    consentimento_lgpd: 1
  };
}

export function validarAtualizacaoOsInput(body = {}) {
  const etapasValidas = [
    '1. Recepção & Checklist',
    '2. Diagnóstico Scanner OBD2',
    '3. Em Elevador / Execução',
    '4. Teste de Rodagem',
    '5. Pronto para Retirada'
  ];
  const etapa_atual = etapasValidas.includes(body.etapa_atual) ? body.etapa_atual : null;
  const relatorio_tecnico = body.relatorio_tecnico ? sanitizar(body.relatorio_tecnico, 500) : null;

  if (!etapa_atual) {
    const err = new Error('Selecione uma etapa válida da Ordem de Serviço.');
    err.statusCode = 400;
    throw err;
  }

  const mapaProgresso = {
    '1. Recepção & Checklist': 20,
    '2. Diagnóstico Scanner OBD2': 40,
    '3. Em Elevador / Execução': 65,
    '4. Teste de Rodagem': 85,
    '5. Pronto para Retirada': 100
  };

  return {
    etapa_atual,
    progresso_pct: mapaProgresso[etapa_atual] || 50,
    relatorio_tecnico
  };
}

export function validarLgpdInput(body = {}) {
  const nome_titular = sanitizar(body.nome_titular, 100);
  const email_titular = sanitizar(body.email_titular, 120).toLowerCase();
  const tipo_direito = ['Confirmacao', 'Acesso', 'Correcao', 'Exclusao'].includes(body.tipo_direito)
    ? body.tipo_direito
    : 'Acesso';
  const detalhes = sanitizar(body.detalhes || '', 400);

  if (nome_titular.length < 3 || !email_titular.includes('@')) {
    const err = new Error('Informe nome completo e e-mail válido.');
    err.statusCode = 400;
    throw err;
  }
  return { nome_titular, email_titular, tipo_direito, detalhes };
}
