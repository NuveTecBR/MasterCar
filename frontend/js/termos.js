import { apiFetch, escapeHtml } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-lgpd-mastercar');
  const fb = document.getElementById('lgpd-fb');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const res = await apiFetch('/api/lgpd', {
        method: 'POST',
        body: JSON.stringify({
          nome_titular: document.getElementById('lgpd-nome').value,
          email_titular: document.getElementById('lgpd-email').value,
          tipo_direito: document.getElementById('lgpd-tipo').value
        })
      });
      fb.innerHTML = `<div style="color: var(--success); font-weight: 700;">✓ Protocolo: ${escapeHtml(res.protocolo)}. ${escapeHtml(res.prazo_resposta)}</div>`;
      form.reset();
    } catch (err) {
      fb.innerHTML = `<div style="color: var(--danger); font-weight: 700;">${escapeHtml(err.message)}</div>`;
    }
  });
});
