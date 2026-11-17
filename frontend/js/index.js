import { apiFetch, escapeHtml } from './api.js';

let servicosCache = [];
let categoriaAtiva = 'Todas';

function formatarMoeda(v) {
  return Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

async function consultarPlaca(placaRaw) {
  const container = document.getElementById('os-resultado-container');
  container.innerHTML = `<p style="color: var(--text-muted);">Consultando elevadores em tempo real...</p>`;

  try {
    const os = await apiFetch(`/api/ordens/consulta?placa=${encodeURIComponent(placaRaw)}`);
    container.innerHTML = `
      <div style="background: var(--bg-card-solid); border: 1.5px solid var(--border-glass); border-radius: var(--radius-sm); padding: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
          <span style="font-family: var(--font-mono); font-weight: 800; color: var(--accent-obd);">
            ${escapeHtml(os.protocolo_os)} • Placa ${escapeHtml(os.placa_veiculo)}
          </span>
          <span style="background: var(--success-bg); color: var(--success); padding: 3px 10px; border-radius: 999px; font-weight: 800; font-size: 0.8rem;">
            ${escapeHtml(os.etapa_atual)} (${os.progresso_pct}%)
          </span>
        </div>
        <div style="font-weight: 800; font-size: 1.05rem; margin-top: 6px;">
          ${escapeHtml(os.modelo_veiculo)} — ${escapeHtml(os.servico_principal)}
        </div>
        <div class="os-progress-track" role="progressbar" aria-valuenow="${os.progresso_pct}" aria-valuemin="0" aria-valuemax="100">
          <div class="os-progress-fill" style="width: ${os.progresso_pct}%;"></div>
        </div>
        <p style="font-family: var(--font-serif); font-size: 0.86rem; color: var(--text-body);">
          <strong>Laudo Técnico (${escapeHtml(os.mecanico_responsavel)}):</strong> ${escapeHtml(os.relatorio_tecnico)}
        </p>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `
      <div style="background: rgba(248, 113, 113, 0.14); border: 1px solid var(--danger); color: var(--danger); padding: 12px; border-radius: var(--radius-sm); font-weight: 700; font-size: 0.88rem;">
        ${escapeHtml(err.message)}
      </div>
    `;
  }
}

async function carregarServicos() {
  const grid = document.getElementById('servicos-grid');
  const contador = document.getElementById('contador-servicos');
  grid.innerHTML = Array.from({ length: 4 }).map(() => `
    <div class="skeleton-card" aria-hidden="true">
      <div class="skeleton-line" style="height: 16px; width: 40%;"></div>
      <div class="skeleton-line" style="height: 26px; width: 85%;"></div>
      <div class="skeleton-line" style="height: 54px; width: 100%;"></div>
      <div class="skeleton-line" style="height: 40px; width: 100%; margin-top: auto;"></div>
    </div>
  `).join('');

  try {
    const params = new URLSearchParams();
    if (categoriaAtiva !== 'Todas') params.set('categoria', categoriaAtiva);
    const lista = await apiFetch(`/api/servicos?${params.toString()}`);

    if (servicosCache.length === 0) {
      servicosCache = lista;
      popularSelectServicos(lista);
      await atualizarCalculoOrcamento();
    }

    contador.textContent = `${lista.length} pacotes técnicos disponíveis`;

    if (lista.length === 0) {
      grid.innerHTML = `
        <div class="service-card">
          <h3 class="service-title">Nenhum serviço encontrado nesta especialidade</h3>
          <p class="service-desc">Limpe o filtro de categoria para visualizar todos os pacotes da oficina.</p>
          <button type="button" id="btn-empty-serv" class="btn btn-primary">Ver Todas as Especialidades</button>
        </div>
      `;
      document.getElementById('btn-empty-serv')?.addEventListener('click', () => {
        categoriaAtiva = 'Todas';
        document.querySelectorAll('.cat-pill').forEach(p => {
          const isTodas = p.getAttribute('data-cat') === 'Todas';
          p.classList.toggle('active', isTodas);
          p.setAttribute('aria-pressed', isTodas ? 'true' : 'false');
        });
        carregarServicos();
      });
      return;
    }

    grid.innerHTML = lista.map(s => `
      <article class="service-card">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span class="service-code">${escapeHtml(s.codigo)}</span>
          <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted);">
            ⏱️ ${escapeHtml(s.tempo_estimado)} • Garantia ${s.garantia_meses}m
          </span>
        </div>
        <h3 class="service-title">${escapeHtml(s.nome)}</h3>
        <p class="service-desc">${escapeHtml(s.descricao)}</p>
        <div style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 14px;">
          <strong style="color: var(--text-main);">Inclui:</strong> ${escapeHtml(s.inclui_itens)}
        </div>
        <div class="service-footer">
          <div>
            <span style="font-size: 0.75rem; color: var(--text-muted); display: block; text-transform: uppercase; font-weight: 700;">A partir de (Porte Leve)</span>
            <strong style="font-family: var(--font-mono); font-size: 1.35rem; color: var(--primary);">${formatarMoeda(s.preco_base)}</strong>
          </div>
          <button type="button" class="btn btn-primary btn-selecionar-servico" data-id="${s.id}" style="min-height: 40px; padding: 8px 16px;">
            Selecionar
          </button>
        </div>
      </article>
    `).join('');

    grid.querySelectorAll('.btn-selecionar-servico').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const sel = document.getElementById('ag-servico');
        if (sel) {
          sel.value = id;
          await atualizarCalculoOrcamento();
          document.getElementById('ag-nome')?.focus();
        }
      });
    });
  } catch (err) {
    grid.innerHTML = `
      <div class="service-card">
        <p style="color: var(--danger); font-weight: 700;">${escapeHtml(err.message)}</p>
        <button type="button" id="btn-retry-serv" class="btn btn-primary" style="margin-top: 10px;">Tentar Novamente</button>
      </div>
    `;
    document.getElementById('btn-retry-serv')?.addEventListener('click', carregarServicos);
  }
}

function popularSelectServicos(lista) {
  const select = document.getElementById('ag-servico');
  if (!select) return;
  select.innerHTML = lista.map(s => `
    <option value="${s.id}">${escapeHtml(s.nome)} (Base ${formatarMoeda(s.preco_base)})</option>
  `).join('');
}

async function atualizarCalculoOrcamento() {
  const box = document.getElementById('box-calculo-orcamento');
  const servico_id = Number(document.getElementById('ag-servico')?.value || 1);
  const porte_veiculo = document.getElementById('ag-porte')?.value || 'Leve (Hatch/Sedan)';

  try {
    const res = await apiFetch('/api/servicos/orcamento', {
      method: 'POST',
      body: JSON.stringify({ servico_id, porte_veiculo })
    });
    box.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: baseline;">
        <span style="font-size: 0.82rem; font-weight: 700; text-transform: uppercase;">Orçamento Prévio (${escapeHtml(res.porte_veiculo)})</span>
        <strong style="font-family: var(--font-mono); font-size: 1.35rem; color: var(--accent-obd);">${formatarMoeda(res.valor_estimado)}</strong>
      </div>
      <span style="font-size: 0.78rem; color: var(--text-muted);">
        Tempo médio: ${escapeHtml(res.servico.tempo_estimado)} • Garantia documentada de ${res.servico.garantia_meses} meses
      </span>
    `;
  } catch (err) {
    box.innerHTML = `<span style="color: var(--danger);">${escapeHtml(err.message)}</span>`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  consultarPlaca('BRA2E19');
  carregarServicos();

  document.getElementById('form-consulta-placa')?.addEventListener('submit', (e) => {
    e.preventDefault();
    consultarPlaca(document.getElementById('input-placa-os').value);
  });

  document.querySelectorAll('.plate-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const p = chip.getAttribute('data-placa');
      document.getElementById('input-placa-os').value = p;
      consultarPlaca(p);
    });
  });

  document.querySelectorAll('.cat-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.cat-pill').forEach(p => {
        p.classList.remove('active');
        p.setAttribute('aria-pressed', 'false');
      });
      pill.classList.add('active');
      pill.setAttribute('aria-pressed', 'true');
      categoriaAtiva = pill.getAttribute('data-cat');
      carregarServicos();
    });
  });

  document.getElementById('ag-servico')?.addEventListener('change', atualizarCalculoOrcamento);
  document.getElementById('ag-porte')?.addEventListener('change', atualizarCalculoOrcamento);

  document.getElementById('btn-topo-guincho')?.addEventListener('click', () => {
    const tipo = document.getElementById('ag-tipo');
    if (tipo) tipo.value = 'Socorro Guincho Urgente';
    document.getElementById('ag-nome')?.focus();
  });

  document.getElementById('form-agendamento-mastercar')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fb = document.getElementById('ag-feedback');
    const btn = document.getElementById('btn-enviar-agendamento');

    btn.disabled = true;
    btn.textContent = 'Gerando Protocolo...';

    try {
      const res = await apiFetch('/api/agendamentos', {
        method: 'POST',
        body: JSON.stringify({
          servico_id: Number(document.getElementById('ag-servico').value),
          tipo_solicitacao: document.getElementById('ag-tipo').value,
          porte_veiculo: document.getElementById('ag-porte').value,
          nome_cliente: document.getElementById('ag-nome').value,
          telefone: document.getElementById('ag-telefone').value,
          placa_veiculo: document.getElementById('ag-placa').value,
          modelo_veiculo: document.getElementById('ag-modelo').value,
          sintomas_relatados: document.getElementById('ag-sintomas').value,
          consentimento_lgpd: document.getElementById('ag-lgpd').checked,
          oficina_website_honeypot: document.getElementById('oficina_website_honeypot').value
        })
      });

      fb.innerHTML = `
        <div style="background: var(--success-bg); border: 1.5px solid var(--success); padding: 14px; border-radius: var(--radius-sm);">
          <strong style="display: block; color: var(--success);">✓ Protocolo Gerado: ${escapeHtml(res.protocolo)}</strong>
          <p style="font-size: 0.85rem; margin: 6px 0 10px;">Orçamento prévio registrado no sistema da oficina.</p>
          <a href="${res.whatsapp_url}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="width: 100%; background: #16A34A;">
            Confirmar Horário no WhatsApp
          </a>
        </div>
      `;
      btn.textContent = 'Protocolo Registrado ✓';
    } catch (err) {
      fb.innerHTML = `<div style="color: var(--danger); font-weight: 700; font-size: 0.88rem;">${escapeHtml(err.message)}</div>`;
      btn.disabled = false;
      btn.textContent = 'Gerar Protocolo e Reservar Box';
    }
  });
});
