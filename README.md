# 🔧 MasterCar — Centro Automotivo & Diagnóstico Computadorizado

[![Node.js](https://img.shields.io/badge/Node.js-v20+-68A063?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v4.21-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-Local_Storage-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://sqlite.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase_Ready-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://supabase.com/)
[![Security](https://img.shields.io/badge/Security-M%C3%A9todo_ENDS_100%25-blueviolet?style=for-the-badge&logo=shield)](https://github.com/NuveTecBR)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

---

## 📌 Visão Geral do Projeto

O **MasterCar** é um sistema web moderno e responsivo desenvolvido para centros automotivos e oficinas mecânicas de alta tecnologia. O projeto implementa a metodologia **ENDS (Eficiência, Nível técnico, Defesa e Segurança)**, fornecendo aos clientes acompanhamento transparente em tempo real do status de seus veículos e facilitando o agendamento de serviços preventivos e corretivos.

A interface foi projetada com base nos princípios do ecossistema **Avada Prebuilt Websites**, incorporando uma barra lateral em estilo Glassmorphism de alta usabilidade e uma faixa de credibilidade técnica.

---

## 🌟 Principais Funcionalidades

- **Consulta e Rastreamento de Ordem de Serviço (OS):**
  - Rastreamento público em tempo real digitando apenas a placa do veículo ou o número da OS.
  - Linha do tempo interativa exibindo as 5 etapas da manutenção: *Recepção*, *Diagnóstico Computadorizado*, *Execução de Serviços*, *Teste de Rodagem* e *Pronto para Retirada*.
- **Agendamento Online de Serviços:**
  - Escolha de categoria (Revisão Periódica, Freios, Injeção Eletrônica, Suspensão, etc.).
  - Seleção de data/hora e cálculo prévio de tempo estimado.
  - Protocolo exclusivo de confirmação gerado na hora com prevenção de duplicidade (idempotência).
- **Calculadora de Orçamento por Porte de Veículo:**
  - Estimativa instantânea de peças e mão de obra calculada server-side de acordo com o segmento (Hatch, Sedan, SUV ou Picape).
- **Barra Lateral de Navegação Glassmorphism:**
  - Layout ergonômico: 88px colapsada (ícones de 42px com feedback tátil) e 260px expandida com rótulos legíveis, aberta por padrão no desktop (`>= 1024px`).
- **Canal de Privacidade LGPD:**
  - Atendimento às solicitações de exclusão, consulta ou retificação de dados pessoais conforme a Lei Geral de Proteção de Dados.

---

## 🎨 Design & Layout (Padrão Avada + Princípios PARC)

- **Trust Strip Avada da Oficina:** Faixa de confiança em posição de destaque na interface:
  1. *Scanner & Diagnóstico Bosch de Última Geração*
  2. *Relatório em Vídeo e Fotos via WhatsApp*
  3. *Peças Originais com 12 Meses de Garantia*
  4. *Assistência Técnica & Guincho 24 Horas*
- **Hierarquia Visual & Respiro:** Espaçamento padronizado de 80px entre blocos de conteúdo para leitura confortável e sem fadiga visual.
- **Microinterações:** Efeitos de elevação suave (`transform: translateY(-4px)`), sombras em camadas e transições CSS de 250ms com aceleração cúbica natural.

---

## 🛡️ Arquitetura & Segurança (Método ENDS)

- **Honeypot Invisível:** Defesa contra spam e submissões automatizadas em todos os formulários públicos.
- **Sanitização de Inputs:** Proteção contra Cross-Site Scripting (XSS) e SQL Injection com escape sistemático e tipagem defensiva.
- **Security Headers Avançados:** Implementação de políticas estritas de CSP, proteção contra clickjacking (`X-Frame-Options: DENY`), e desativação de MIME sniffing (`X-Content-Type-Options: nosniff`).
- **Rate Limiting Especializado:**
  - Proteção contra enumeração de ordens de serviço.
  - Limite para envio de agendamentos e solicitações LGPD.
  - Proteção por IP contra força bruta na rota administrativa de login.
- **Autenticação Segura:** Senhas em hash **Bcrypt** e tokens **JWT** para operadores e chefes de oficina.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** HTML5 Semântico, CSS3 Moderno (Glassmorphism, CSS Custom Properties, Flexbox e Grid), JavaScript ES6+ nativo.
- **Backend:** Node.js (v20+), Express.js (v4.21).
- **Banco de Dados:** SQLite integrado com arquitetura preparada para PostgreSQL (Supabase Pooler).
- **Segurança:** Bcrypt.js, JsonWebToken, Dotenv, Middlewares customizados.

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18 ou superior).
- `npm` instalado.

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/NuveTecBR/MasterCar.git
   cd MasterCar
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   ```bash
   cp backend/.env.example backend/.env
   ```
   *(No Windows PowerShell: `Copy-Item backend\.env.example backend\.env`)*

4. **Inicie a aplicação:**
   ```bash
   npm start
   ```
   O servidor estará ativo na porta **3335**:
   - **Interface Web:** [http://localhost:3335](http://localhost:3335)
   - **Health Check:** [http://localhost:3335/api/health](http://localhost:3335/api/health)

5. **Execute a Suíte de Testes Automatizados:**
   ```bash
   npm test
   ```

---

## 🧪 Suíte de Testes Automatizados

O sistema conta com suíte de testes de integração (`backend/test_suite.js`) com 100% de aprovação:

- [x] Health check e conformidade dos Security Headers.
- [x] Catálogo de serviços e calculadora de orçamento por porte.
- [x] Consulta pública de Ordem de Serviço por placa/número.
- [x] Agendamento online, proteção contra duplicidade e Honeypot anti-bot.
- [x] Autenticação administrativa JWT e atualização de status de OS.

---

## 📡 Endpoints da API REST

| Método | Endpoint | Acesso | Descrição |
|---|---|---|---|
| `GET` | `/api/health` | Público | Verificação de status e telemetria |
| `GET` | `/api/servicos` | Público | Catálogo de manutenções e serviços |
| `POST` | `/api/servicos/orcamento` | Público | Cálculo server-side de orçamento por porte |
| `GET` | `/api/ordens/consulta` | Público | Consulta de status da OS por placa ou código |
| `POST` | `/api/agendamentos` | Público (Rate-Limited) | Envio de solicitação de agendamento |
| `POST` | `/api/lgpd` | Público (Rate-Limited) | Canal de privacidade do titular dos dados |
| `POST` | `/api/auth/login` | Público (Rate-Limited) | Autenticação técnica de mecânicos e consultores |
| `GET` | `/api/ordens` | Privado (JWT) | Painel geral de ordens de serviço da oficina |
| `GET` | `/api/agendamentos` | Privado (JWT) | Gestão administrativa de agendamentos |

---

## 📂 Estrutura de Pastas

```
MasterCar/
├── backend/
│   ├── controllers/      # Regras de negócio da oficina e ordens de serviço
│   ├── database/         # Schemas e conexão do banco de dados
│   ├── middlewares/      # Segurança, rate limiters, auth e validação
│   ├── routes/           # Rotas da API REST
│   ├── services/         # Cálculo de orçamentos e serviços auxiliares
│   ├── validators/       # Validação de schemas e sanitização
│   ├── .env.example      # Exemplo de configuração
│   ├── package.json      # Dependências e scripts Node.js
│   ├── server.js         # Servidor Express principal
│   └── test_suite.js     # Testes automatizados de integração
├── frontend/
│   ├── css/              # Estilos modulares e tema Glassmorphism
│   ├── js/               # Lógica client-side e integração com a API
│   └── index.html        # Página principal da oficina
├── sql/
│   └── schema.sql        # Script de inicialização do banco
├── .gitignore            # Exclusões de versionamento
├── iniciar.ps1           # Script de inicialização rápida
├── package.json          # Orquestrador de comandos da raiz
└── README.md             # Esta documentação
```

---

## 📄 Licença

Projeto distribuído sob a licença [MIT](LICENSE). Desenvolvido por **NuveTec** ([@NuveTecBR](https://github.com/NuveTecBR)) para o portfólio Nuvetec.
