/**
 * MasterCar — Barra Lateral Retrátil Inteligente (Padrão Glass Side Bar Fuzzy/Avada)
 * + Alternador de Tema Escuro/Claro + Banner de Cookies LGPD
 */
import { obterUsuarioLogado } from './api.js';

const PIN_KEY = 'mastercar_sidebar_pinned';
const THEME_KEY = 'mastercar_theme_mode';
const COOKIE_KEY = 'mastercar_lgpd_cookies_v1';

export function inicializarLayoutGlassSidebar() {
  aplicarTemaSalvo();
  montarSidebar();
  montarCookieBanner();
}

function aplicarTemaSalvo() {
  const tema = localStorage.getItem(THEME_KEY) || 'dark';
  document.documentElement.setAttribute('data-theme', tema);
}

function montarSidebar() {
  const mount = document.getElementById('sidebar-mount');
  if (!mount) return;

  const savedPin = localStorage.getItem(PIN_KEY);
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;
  const isPinned = savedPin !== null ? savedPin === 'true' : isDesktop;
  if (isPinned) document.body.classList.add('sidebar-pinned');

  const path = window.location.pathname;
  const usuario = obterUsuarioLogado();
  const iniciais = usuario
    ? usuario.nome.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
    : 'MC';

  mount.innerHTML = `
    <aside id="glassSidebar" class="glass-sidebar ${isPinned ? 'is-pinned' : ''}" aria-label="Menu Lateral Retrátil MasterCar">
      <div>
        <div class="sidebar-top">
          <a href="./index.html" class="sidebar-brand" title="MasterCar Oficina & Diagnóstico">
            <div class="sidebar-logo-badge" aria-hidden="true">🔧</div>
            <div class="sidebar-brand-title">
              <strong style="font-size: 1.3rem; display: block; line-height: 1;">MasterCar</strong>
              <span style="font-size: 0.78rem; color: var(--accent-obd);">Diagnóstico & Auto Center</span>
            </div>
          </a>
          <button type="button" id="btnPinSidebar" class="sidebar-pin-btn" aria-label="Fixar ou recolher barra lateral" title="Fixar Barra Lateral">
            📌
          </button>
        </div>

        <ul class="sidebar-nav">
          <li>
            <a href="./index.html#rastreador-os" class="sidebar-link ${path.endsWith('index.html') || path === '/' ? 'active' : ''}" title="Rastrear Ordem de Serviço por Placa">
              <span class="sidebar-icon" aria-hidden="true">📡</span>
              <span class="sidebar-label">Rastrear OS por Placa</span>
            </a>
          </li>
          <li>
            <a href="./index.html#catalogo-servicos" class="sidebar-link" title="Tabela de Serviços e Revisão">
              <span class="sidebar-icon" aria-hidden="true">⚙️</span>
              <span class="sidebar-label">Serviços & Revisão</span>
            </a>
          </li>
          <li>
            <a href="./index.html#box-agendamento" class="sidebar-link" title="Simular Orçamento e Agendar">
              <span class="sidebar-icon" aria-hidden="true">📅</span>
              <span class="sidebar-label">Orçamento & Guincho</span>
            </a>
          </li>
          <li>
            <a href="./painel.html" class="sidebar-link ${path.includes('painel.html') ? 'active' : ''}" title="Painel do Chefe de Oficina">
              <span class="sidebar-icon" aria-hidden="true">🔐</span>
              <span class="sidebar-label">Painel da Oficina</span>
            </a>
          </li>
          <li>
            <a href="./termos.html" class="sidebar-link ${path.includes('termos.html') ? 'active' : ''}" title="Garantia CDC & Privacidade LGPD">
              <span class="sidebar-icon" aria-hidden="true">🛡️</span>
              <span class="sidebar-label">Garantia CDC & LGPD</span>
            </a>
          </li>
        </ul>
      </div>

      <div class="sidebar-bottom">
        <button type="button" id="btnToggleTheme" class="sidebar-link" style="width: 100%; background: transparent; border: 1px solid var(--border-glass); cursor: pointer;" title="Alternar Tema Dark Industrial / Clean Light">
          <span class="sidebar-icon" aria-hidden="true">🌓</span>
          <span class="sidebar-label">Alternar Tema Visual</span>
        </button>

        <a href="./painel.html" class="sidebar-link" title="Perfil da Conta">
          <span class="sidebar-icon" style="background: var(--accent-obd); color: #0B0F19; border-radius: 50%; width: 32px; height: 32px; display: inline-flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.85rem;">
            ${iniciais}
          </span>
          <span class="sidebar-label" style="font-size: 0.88rem;">
            ${usuario ? usuario.nome.split(' ')[0] + ' (Logado)' : 'Acesso Técnico Demo'}
          </span>
        </a>
      </div>
    </aside>
  `;

  const btnPin = document.getElementById('btnPinSidebar');
  btnPin?.addEventListener('click', () => {
    const sb = document.getElementById('glassSidebar');
    const pinned = sb.classList.toggle('is-pinned');
    document.body.classList.toggle('sidebar-pinned', pinned);
    localStorage.setItem(PIN_KEY, pinned ? 'true' : 'false');
    btnPin.textContent = pinned ? '◀' : '📌';
    btnPin.title = pinned ? 'Recolher barra lateral' : 'Fixar barra lateral aberta';
  });

  document.getElementById('btnToggleTheme')?.addEventListener('click', () => {
    const atual = document.documentElement.getAttribute('data-theme') || 'dark';
    const novo = atual === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', novo);
    localStorage.setItem(THEME_KEY, novo);
  });
}

function montarCookieBanner() {
  if (localStorage.getItem(COOKIE_KEY)) return;

  const bar = document.createElement('aside');
  bar.setAttribute('role', 'region');
  bar.setAttribute('aria-label', 'Consentimento de Cookies LGPD');
  bar.style.cssText = 'position: fixed; bottom: 16px; left: 88px; right: 16px; max-width: 900px; margin: 0 auto; background: var(--bg-surface); border: 1.5px solid var(--border-strong); border-radius: 14px; padding: 18px 22px; z-index: 950; box-shadow: 0 20px 40px rgba(0,0,0,0.5);';
  bar.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap;">
      <div style="max-width: 64ch;">
        <strong style="display: block; font-size: 1rem;">🍪 Privacidade e Cookies MasterCar (LGPD)</strong>
        <p style="font-size: 0.88rem; color: var(--text-body);">
          Usamos armazenamento local estritamente para salvar suas preferências de tema (Dark/Light), barra lateral e sessão autenticada. Veja nossos <a href="./termos.html" style="color: var(--accent-obd); font-weight: 700;">Termos e Direitos LGPD</a>.
        </p>
      </div>
      <div style="display: flex; gap: 10px;">
        <button type="button" id="btnCookieEssencial" class="btn btn-outline">Apenas Essenciais</button>
        <button type="button" id="btnCookieAceitar" class="btn btn-primary">Aceitar e Continuar</button>
      </div>
    </div>
  `;
  document.body.appendChild(bar);

  const salvar = (todos) => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify({ essenciais: true, analiticos: todos, ts: Date.now() }));
    bar.remove();
  };
  document.getElementById('btnCookieEssencial')?.addEventListener('click', () => salvar(false));
  document.getElementById('btnCookieAceitar')?.addEventListener('click', () => salvar(true));
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarLayoutGlassSidebar);
  } else {
    inicializarLayoutGlassSidebar();
  }
}
