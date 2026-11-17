import jwt from 'jsonwebtoken';

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error('Configuração crítica: JWT_SECRET ausente.');
  }
  return secret;
}

function extrairCookieToken(req) {
  const raw = req.headers.cookie;
  if (!raw) return null;
  const match = raw.split(';').map(c => c.trim()).find(c => c.startsWith('mastercar_session='));
  return match ? decodeURIComponent(match.split('=')[1]) : null;
}

export function exigirAutenticacao(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = (authHeader && authHeader.startsWith('Bearer '))
    ? authHeader.split(' ')[1]
    : extrairCookieToken(req);

  if (!token) {
    return res.status(401).json({ erro: 'Autenticação necessária para acessar o painel da oficina.' });
  }

  try {
    const payload = jwt.verify(token, getJwtSecret());
    req.user = { id: payload.id, nome: payload.nome, email: payload.email, cargo: payload.cargo };
    next();
  } catch {
    return res.status(401).json({ erro: 'Sessão inválida ou expirada.' });
  }
}

export function exigirCargo(...cargos) {
  return (req, res, next) => {
    if (!req.user || !cargos.includes(req.user.cargo)) {
      return res.status(403).json({ erro: 'Permissão insuficiente para executar esta operação.' });
    }
    next();
  };
}
