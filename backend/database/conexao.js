import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, 'mastercar.sqlite');
const sqlPath = path.resolve(__dirname, '../../sql/mastercar.sql');

export const db = new DatabaseSync(dbPath);
db.exec(fs.readFileSync(sqlPath, 'utf-8'));

export function query(sql, params = []) {
  return db.prepare(sql).all(...params);
}

export function get(sql, params = []) {
  return db.prepare(sql).get(...params) || null;
}

export function run(sql, params = []) {
  const res = db.prepare(sql).run(...params);
  return {
    changes: Number(res.changes),
    lastInsertRowid: Number(res.lastInsertRowid)
  };
}

function inicializarSeeds() {
  const countUsers = get('SELECT COUNT(*) as total FROM usuarios');
  if (countUsers && countUsers.total === 0) {
    const hashChefe = bcrypt.hashSync('MasterCar@2026', 10);
    const hashConsultor = bcrypt.hashSync('Oficina@2026', 10);

    run(
      'INSERT INTO usuarios (nome, email, senha_hash, cargo) VALUES (?, ?, ?, ?)',
      ['Eng. Henrique Vasconcelos (Chefe de Oficina)', 'oficina@mastercar-demo.com.br', hashChefe, 'chefe_oficina']
    );
    run(
      'INSERT INTO usuarios (nome, email, senha_hash, cargo) VALUES (?, ?, ?, ?)',
      ['Diego Ribeiro (Consultor Técnico)', 'atendimento@mastercar-demo.com.br', hashConsultor, 'consultor']
    );
  }

  const countServicos = get('SELECT COUNT(*) as total FROM servicos');
  if (countServicos && countServicos.total === 0) {
    const listaServicos = [
      [
        'SRV-REV-40K', 'Revisão Preventiva Completa + Checklist 60 Itens', 'Revisão Preventiva',
        489.00, '3h30 no box', 12,
        'Troca de óleo 100% sintético API SP, filtro de óleo, filtro de ar do motor, filtro de combustível, leitura via Scanner OBD2 e inspeção de freios e suspensão.',
        'Óleo Sintético (4L), 3 Filtros Originais, Alinhamento Computadorizado 3D, Laudo Digital em PDF', 1
      ],
      [
        'SRV-FRE-ABS', 'Manutenção Completa de Freios ABS (Pastilhas + Fluido DOT4)', 'Freios & Suspensão',
        379.00, '2h00 no box', 6,
        'Substituição do jogo de pastilhas dianteiras cerâmicas silenciosas, medição de empenamento dos discos com relógio comparador e sangria eletrônica do fluido DOT4.',
        'Jogo de Pastilhas Cerâmicas, Fluido Bosch DOT4, Sangria Eletrônica ABS, Limpeza Técnica das Pinças', 1
      ],
      [
        'SRV-INJ-OBD', 'Diagnóstico Computadorizado OBD2 + Limpeza de Bicos por Ultrassom', 'Injeção & Diagnóstico',
        295.00, '2h30 no box', 6,
        'Rastreamento de falhas de ignição, consumo elevado ou luz de injeção acesa no painel. Equalização de bicos injetores em bancada de ultrassom e reset de parâmetros.',
        'Scanner Bosch KTS / Raven, Limpeza em Cuba Ultrassônica, Kit de Anéis O-Ring Viton, Descarbonização de TBI', 1
      ],
      [
        'SRV-SUS-3D', 'Kit Amortecedores, Bandejas + Geometria 3D', 'Freios & Suspensão',
        440.00, '4h00 no box', 12,
        'Eliminação de barulhos na suspensão, troca de bieletas, buchas de bandeja ou amortecedores (mão de obra + geometria 3D e balanceamento das 4 rodas).',
        'Inspeção em Folgômetro, Alinhamento 3D a Laser, Balanceamento Dinâmico, Reaperto com Torquímetro', 0
      ],
      [
        'SRV-ARC-HIG', 'Carga de Gás R134a por Peso + Higienização por Ozônio', 'Ar-Condicionado',
        239.00, '1h30 no box', 6,
        'Reciclagem completa do gás refrigerante em estação computadorizada, teste de estanqueidade com contraste UV, troca do filtro de cabine antipólen e oxi-sanitização.',
        'Gás R134a Puro + Óleo PAG, Filtro de Cabine Carvão Ativado, Aplicação de Ozônio Bactericida', 0
      ],
      [
        'SRV-CAM-ATF', 'Troca Total de Fluido de Câmbio Automático / CVT por Diálise', 'Câmbio & Motor',
        890.00, '4h30 no box', 12,
        'Substituição de 100% do fluido da transmissão automática via máquina de diálise computadorizada, prevenindo trancos, patinação e superaquecimento.',
        'Máquina de Diálise Automática, Fluido Sintético Homologado (Dexron VI / CVT), Reset de Adaptação Eletrônica', 1
      ]
    ];

    for (const s of listaServicos) {
      run(
        `INSERT INTO servicos (codigo, nome, categoria, preco_base, tempo_estimado, garantia_meses, descricao, inclui_itens, destaque)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        s
      );
    }

    // Ordens de Serviço Demonstrativas para Consulta Ao Vivo por Placa
    const ordens = [
      [
        'OS-2026-8841', 'BRA2E19', 'VW T-Cross 1.4 TSI Highline 2023', 'Fernando Magalhães (Fictício)',
        'Revisão Preventiva Completa + Freios ABS', '3. Em Elevador / Execução', 65,
        'Mestre Mecânico Rodrigo S.',
        'Óleo e filtros já substituídos. Pastilhas dianteiras novas instaladas com torquímetro. Iniciando sangria eletrônica do fluido de freio DOT4.',
        868.00
      ],
      [
        'OS-2026-8842', 'QXZ4G88', 'Honda Civic Touring 1.5 Turbo', 'Patrícia Vasconcelos (Fictício)',
        'Troca de Fluido de Câmbio CVT por Diálise', '5. Pronto para Retirada', 100,
        'Eng. Henrique Vasconcelos',
        'Diálise concluída com fluido genuíno HCF-2. Teste de rodagem de 8km realizado sem anomalias e lavagem de cortesia finalizada.',
        890.00
      ],
      [
        'OS-2026-8845', 'FSP9A12', 'Jeep Renegade 1.8 Longitude', 'Ricardo Gomes (Fictício)',
        'Diagnóstico OBD2 + Arrefecimento', '2. Diagnóstico Scanner OBD2', 35,
        'Técnico Diagnóstico André M.',
        'Scanner identificou falha intermitente na válvula termostática e sensor de temperatura. Orçamento prévio enviado para aprovação no WhatsApp.',
        520.00
      ]
    ];

    for (const o of ordens) {
      run(
        `INSERT INTO ordens_servico (
          protocolo_os, placa_veiculo, modelo_veiculo, nome_cliente, servico_principal,
          etapa_atual, progresso_pct, mecanico_responsavel, relatorio_tecnico, valor_orcamento
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        o
      );
    }
  }
}

inicializarSeeds();

export default { db, query, get, run };
