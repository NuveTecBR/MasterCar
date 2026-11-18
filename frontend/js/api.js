const TOKEN_KEY = 'mastercar_jwt_token';
const USER_KEY = 'mastercar_user_data';

export function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function salvarSessao(token, usuario) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(usuario));
}

export function obterToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function obterUsuarioLogado() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function limparSessao() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

async function staticDemoFetch(endpoint, options = {}) {
  const { DEMO_DATA } = await import('./demo-data.js');
  const url = new URL(endpoint, 'https://demo.local');
  const path = url.pathname;
  const body = options.body ? JSON.parse(options.body) : {};

  if (path === '/api/servicos') {
    const cat = url.searchParams.get('categoria');
    return cat ? DEMO_DATA.servicos.filter(s => s.categoria === cat) : [...DEMO_DATA.servicos];
  }

  if (path === '/api/ordens/consulta') {
    const placa = (url.searchParams.get('placa') || '').replace(/[^A-Z0-9]/gi, '').toUpperCase();
    const os = DEMO_DATA.ordens.find(o => o.placa_veiculo === placa || o.protocolo_os === placa);
    if (!os) throw new Error('Ordem de serviço não encontrada para a placa informada.');
    return os;
  }

  if (path === '/api/servicos/orcamento') {
    const srv = DEMO_DATA.servicos.find(s => s.id === Number(body.servico_id)) || DEMO_DATA.servicos[0];
    const mult = body.porte_veiculo?.includes('SUV') ? 1.22 : (body.porte_veiculo?.includes('Picape') ? 1.38 : 1);
    return {
      porte_veiculo: body.porte_veiculo || 'Leve (Hatch/Sedan)',
      valor_estimado: Number((srv.preco_base * mult).toFixed(2)),
      servico: srv
    };
  }

  if (path === '/api/agendamentos') {
    const orc = await staticDemoFetch('/api/servicos/orcamento', { body: JSON.stringify(body) });
    const protocolo = `MTC-DEMO-${Math.floor(1000 + Math.random() * 9000)}`;
    return {
      protocolo,
      valor_estimado: orc.valor_estimado,
      whatsapp_url: `https://wa.me/5551999990000?text=${encodeURIComponent(`Olá! Agendamento MasterCar (${protocolo})`)}`
    };
  }

  return {};
}

export async function apiFetch(endpoint, options = {}) {
  if (typeof window !== 'undefined' && window.location.hostname.endsWith('github.io')) {
    return staticDemoFetch(endpoint, options);
  }

  const token = obterToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(endpoint, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.erro || `Falha HTTP ${res.status}`);
  }
  return data;
}
