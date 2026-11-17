import { Router } from 'express';
import { oficinaController } from '../controllers/oficinaController.js';
import { exigirAutenticacao, exigirCargo } from '../middlewares/authMiddleware.js';
import { authRateLimiter, apiPublicLimiter, formSubmitLimiter } from '../middlewares/rateLimitMiddleware.js';

const router = Router();

// Autenticação
router.post('/auth/login', authRateLimiter, oficinaController.login);
router.post('/auth/logout', oficinaController.logout);

// Rotas Públicas da Oficina
router.get('/servicos', apiPublicLimiter, oficinaController.listarServicos);
router.post('/servicos/orcamento', apiPublicLimiter, oficinaController.calcularOrcamento);
router.get('/ordens/consulta', apiPublicLimiter, oficinaController.consultarOsPublica);
router.post('/agendamentos', formSubmitLimiter, oficinaController.criarAgendamento);
router.post('/lgpd', formSubmitLimiter, oficinaController.criarSolicitacaoLgpd);

// Rotas Privadas do Chefe de Oficina / Consultor (JWT + RBAC)
router.get('/ordens', exigirAutenticacao, exigirCargo('chefe_oficina', 'consultor'), oficinaController.listarOrdensAdmin);
router.patch('/ordens/:id', exigirAutenticacao, exigirCargo('chefe_oficina', 'consultor'), oficinaController.atualizarOrdemAdmin);
router.get('/agendamentos', exigirAutenticacao, exigirCargo('chefe_oficina', 'consultor'), oficinaController.listarAgendamentosAdmin);

export default router;
