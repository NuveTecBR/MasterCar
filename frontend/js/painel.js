import { apiFetch, escapeHtml, salvarSessao, obterUsuarioLogado, limparSessao } from './api.js';

const secLogin = document.getElementById('secao-login-split');
const secPainel = document.getElementById('secao-painel-oficina');

async function verificarEstadoPainel() {
  const u = obterUsuarioLogado();
  if (!u) {
    secLogin.style.display = 'grid';
    secPainel.style.display = 'none';
    return;
  }

  secLogin.style.display = 'none';
  secPainel.style.display = 'block';
  document.getElementById('info-usuario-logado').textContent = `Operador Autenticado: ${u.nome} (${u.cargo})`;
  await carregarOrdensEAgendamentos();
}

async function carregarOrdensEAgendamentos() {
  try {
    const [ordens, agendamentos] = await Promise.all([
      apiFetch('/api/ordens'),
      apiFetch('/api/agendamentos')
    ]);

    const ordensEl = document.getElementById('lista-ordens-admin');
    ordensEl.innerHTML = ordens.map(o => `
      <div class="service-card">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 10px;">
          <div>
            <strong style="font-family: var(--font-mono); color: var(--accent-obd); font-size: 1rem;">
              ${escapeHtml(o.protocolo_os)} • Placa ${escapeHtml(o.placa_veiculo)}
            </strong>
            <div style="font-size: 1.2rem; font-weight: 800;">${escapeHtml(o.modelo_veiculo)} — Cliente: ${escapeHtml(o.nome_cliente)}</div>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <label for="sel-etapa-${o.id}" style="font-weight: 700; font-size: 0.85rem;">Etapa no Elevador:</label>
            <select id="sel-etapa-${o.id}" class="form-select select-etapa-os" data-id="${o.id}" style="width: auto; min-height: 38px;">
              ${[
                '1. Recepção & Checklist',
                '2. Diagnóstico Scanner OBD2',
                '3. Em Elevador / Execução',
                '4. Teste de Rodagem',
                '5. Pronto para Retirada'
              ].map(et => `<option value="${et}" ${o.etapa_atual === et ? 'selected' : ''}>${et}</option>`).join('')}
            </select>
          </div>
        </div>
        <p style="font-family: var(--font-serif); font-size: 0.88rem; color: var(--text-body);">
          Laudo Atual: ${escapeHtml(o.relatorio_tecnico)}
        </p>
      </div>
    `).join('');

    ordensEl.querySelectorAll('.select-etapa-os').forEach(sel => {
      sel.addEventListener('change', async (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const etapa_atual = e.currentTarget.value;
        await apiFetch(`/api/ordens/${id}`, {
          method: 'PATCH',
          body: JSON.stringify({ etapa_atual })
        });
        await carregarOrdensEAgendamentos();
      });
    });

    const agEl = document.getElementById('lista-agendamentos-admin');
    agEl.innerHTML = agendamentos.length === 0
      ? `<p style="color: var(--text-muted);">Nenhum agendamento registrado.</p>`
      : agendamentos.map(a => `
        <div class="service-card" style="padding: 16px;">
          <strong style="font-family: var(--font-mono); color: var(--primary);">${escapeHtml(a.protocolo)} (${escapeHtml(a.tipo_solicitacao)})</strong>
          <div style="font-weight: 800;">${escapeHtml(a.nome_cliente)} • ${escapeHtml(a.telefone)} — ${escapeHtml(a.modelo_veiculo)} (${escapeHtml(a.placa_veiculo)})</div>
          <div style="font-size: 0.88rem; color: var(--text-body);">
            Serviço: ${escapeHtml(a.servico_nome)} • Estimativa: R$ ${Number(a.valor_estimado).toLocaleString('pt-BR')}
          </div>
        </div>
      `).join('');
  } catch {
    limparSessao();
    verificarEstadoPainel();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  verificarEstadoPainel();

  document.getElementById('btn-fill-chefe')?.addEventListener('click', () => {
    document.getElementById('login-email').value = 'oficina@mastercar-demo.com.br';
    document.getElementById('login-senha').value = 'MasterCar@2026';
  });

  document.getElementById('btn-fill-consultor')?.addEventListener('click', () => {
    document.getElementById('login-email').value = 'atendimento@mastercar-demo.com.br';
    document.getElementById('login-senha').value = 'Oficina@2026';
  });

  document.getElementById('form-login-oficina')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fb = document.getElementById('login-feedback');
    try {
      const res = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: document.getElementById('login-email').value,
          senha: document.getElementById('login-senha').value
        })
      });
      salvarSessao(res.token, res.usuario);
      await verificarEstadoPainel();
    } catch (err) {
      fb.innerHTML = `<span style="color: var(--danger); font-weight: 700;">${escapeHtml(err.message)}</span>`;
    }
  });

  document.getElementById('btn-logout-oficina')?.addEventListener('click', async () => {
    await apiFetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    limparSessao();
    verificarEstadoPainel();
  });
});
