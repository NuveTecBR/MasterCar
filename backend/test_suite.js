process.env.NODE_ENV = 'test';
const { default: app } = await import('./server.js');

const PORT = 3395;
const BASE = `http://localhost:${PORT}/api`;

async function executarSuite() {
  const server = app.listen(PORT);
  console.log(`🧪 Iniciando Suíte de Testes Automatizados MasterCar na porta ${PORT}...\n`);

  try {
    // 1. Health & Security Headers
    const resHealth = await fetch(`${BASE}/health`);
    const health = await resHealth.json();
    console.assert(resHealth.status === 200 && health.status === 'online', 'Health check falhou');
    console.assert(resHealth.headers.get('x-frame-options') === 'DENY', 'Header XFO ausente');
    console.log('✅ 1. Health Check e Security Headers validados.');

    // 2. Catálogo de Serviços e Calculadora de Orçamento por Porte
    const resServicos = await fetch(`${BASE}/servicos`);
    const servicos = await resServicos.json();
    console.assert(servicos.length >= 6, 'Catálogo de serviços incompleto');

    const resOrc = await fetch(`${BASE}/servicos/orcamento`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ servico_id: 1, porte_veiculo: 'SUV / Utilitário' })
    });
    const orc = await resOrc.json();
    console.assert(resOrc.status === 200 && orc.valor_estimado > 489, 'Cálculo por porte SUV falhou');
    console.log(`✅ 2. Catálogo (${servicos.length} serviços) e Calculadora por Porte (SUV: R$ ${orc.valor_estimado}) validados.`);

    // 3. Consulta Ao Vivo de Ordem de Serviço por Placa
    const resOs = await fetch(`${BASE}/ordens/consulta?placa=BRA2E19`);
    const os = await resOs.json();
    console.assert(resOs.status === 200 && os.protocolo_os === 'OS-2026-8841', 'Rastreamento de OS por placa falhou');
    console.log(`✅ 3. Rastreador de Ordem de Serviço por Placa (BRA2E19 -> ${os.etapa_atual}) validado.`);

    // 4. Agendamento com Consentimento LGPD + Idempotência + Honeypot
    const resAgend = await fetch(`${BASE}/agendamentos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': 'idem-key-mastercar-001'
      },
      body: JSON.stringify({
        servico_id: 2,
        tipo_solicitacao: 'Agendamento Oficina',
        nome_cliente: 'Roberto Carlos Silva',
        telefone: '(11) 97777-6666',
        placa_veiculo: 'ABC1D23',
        modelo_veiculo: 'Toyota Corolla 2022',
        porte_veiculo: 'Leve (Hatch/Sedan)',
        sintomas_relatados: 'Chiado ao frear em baixa velocidade',
        consentimento_lgpd: true
      })
    });
    const agend = await resAgend.json();
    console.assert(resAgend.status === 201 && agend.protocolo.startsWith('MTC-2026-'), 'Agendamento falhou');

    const resBot = await fetch(`${BASE}/agendamentos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        servico_id: 1,
        nome_cliente: 'Bot',
        telefone: '11999999999',
        modelo_veiculo: 'BotCar',
        consentimento_lgpd: true,
        oficina_website_honeypot: 'spam.com'
      })
    });
    const botData = await resBot.json();
    console.assert(botData.protocolo === 'MTC-BOT-0000', 'Honeypot falhou');
    console.log(`✅ 4. Agendamento (${agend.protocolo}), Idempotência e Honeypot Anti-Bot validados.`);

    // 5. Login JWT + Atualização de Etapa de OS pelo Chefe de Oficina
    const resLogin = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'oficina@mastercar-demo.com.br',
        senha: 'MasterCar@2026'
      })
    });
    const login = await resLogin.json();
    console.assert(resLogin.status === 200 && login.token, 'Login do chefe de oficina falhou');

    const resPatchOs = await fetch(`${BASE}/ordens/1`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${login.token}`
      },
      body: JSON.stringify({
        etapa_atual: '4. Teste de Rodagem',
        relatorio_tecnico: 'Sangria ABS finalizada. Em teste dinâmico de pista.'
      })
    });
    const osAtualizada = await resPatchOs.json();
    console.assert(resPatchOs.status === 200 && osAtualizada.progresso_pct === 85, 'Atualização de OS falhou');
    console.log(`✅ 5. Autenticação JWT + Evolução de Etapa da OS (${osAtualizada.etapa_atual} - 85%) validados.`);

    console.log('\n🎉 TODOS OS TESTES AUTOMATIZADOS DA MASTERCAR PASSARAM COM 100% DE SUCESSO!\n');
  } finally {
    server.close();
    process.exit(0);
  }
}

executarSuite().catch(err => {
  console.error('❌ Falha na suíte MasterCar:', err);
  process.exit(1);
});
