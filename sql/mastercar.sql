-- ============================================================================
-- MASTERCAR OFICINA & DIAGNÓSTICO — DDL & SEEDS (SQLite / Método ENDS)
-- Aviso: Dados 100% fictícios para demonstração de portfólio Nuvetec
-- ============================================================================

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  senha_hash TEXT NOT NULL,
  cargo TEXT NOT NULL DEFAULT 'chefe_oficina' CHECK (cargo IN ('chefe_oficina', 'consultor')),
  criado_em TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS servicos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  codigo TEXT NOT NULL UNIQUE,
  nome TEXT NOT NULL,
  categoria TEXT NOT NULL CHECK (categoria IN ('Revisão Preventiva', 'Freios & Suspensão', 'Injeção & Diagnóstico', 'Ar-Condicionado', 'Câmbio & Motor')),
  preco_base REAL NOT NULL CHECK (preco_base > 0),
  tempo_estimado TEXT NOT NULL,
  garantia_meses INTEGER NOT NULL DEFAULT 6,
  descricao TEXT NOT NULL,
  inclui_itens TEXT NOT NULL,
  destaque INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS ordens_servico (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  protocolo_os TEXT NOT NULL UNIQUE,
  placa_veiculo TEXT NOT NULL,
  modelo_veiculo TEXT NOT NULL,
  nome_cliente TEXT NOT NULL,
  servico_principal TEXT NOT NULL,
  etapa_atual TEXT NOT NULL CHECK (etapa_atual IN ('1. Recepção & Checklist', '2. Diagnóstico Scanner OBD2', '3. Em Elevador / Execução', '4. Teste de Rodagem', '5. Pronto para Retirada')),
  progresso_pct INTEGER NOT NULL DEFAULT 20 CHECK (progresso_pct BETWEEN 0 AND 100),
  mecanico_responsavel TEXT NOT NULL,
  relatorio_tecnico TEXT NOT NULL,
  valor_orcamento REAL NOT NULL,
  atualizado_em TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS agendamentos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  protocolo TEXT NOT NULL UNIQUE,
  servico_id INTEGER NOT NULL,
  tipo_solicitacao TEXT NOT NULL DEFAULT 'Agendamento Oficina' CHECK (tipo_solicitacao IN ('Agendamento Oficina', 'Socorro Guincho Urgente', 'Orçamento Preventivo')),
  nome_cliente TEXT NOT NULL,
  telefone TEXT NOT NULL,
  placa_veiculo TEXT NOT NULL,
  modelo_veiculo TEXT NOT NULL,
  porte_veiculo TEXT NOT NULL DEFAULT 'Leve (Hatch/Sedan)' CHECK (porte_veiculo IN ('Leve (Hatch/Sedan)', 'SUV / Utilitário', 'Picape / Diesel')),
  valor_estimado REAL NOT NULL,
  sintomas_relatados TEXT,
  consentimento_lgpd INTEGER NOT NULL CHECK (consentimento_lgpd = 1),
  status TEXT NOT NULL DEFAULT 'Aguardando Confirmação',
  criado_em TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (servico_id) REFERENCES servicos(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS solicitacoes_lgpd (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  protocolo TEXT NOT NULL UNIQUE,
  nome_titular TEXT NOT NULL,
  email_titular TEXT NOT NULL,
  tipo_direito TEXT NOT NULL CHECK (tipo_direito IN ('Confirmacao', 'Acesso', 'Correcao', 'Exclusao')),
  detalhes TEXT,
  status TEXT NOT NULL DEFAULT 'Recebido',
  criado_em TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_servicos_categoria ON servicos(categoria);
CREATE INDEX IF NOT EXISTS idx_os_placa ON ordens_servico(placa_veiculo);
CREATE INDEX IF NOT EXISTS idx_os_protocolo ON ordens_servico(protocolo_os);
CREATE INDEX IF NOT EXISTS idx_agendamentos_protocolo ON agendamentos(protocolo);
