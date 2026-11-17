import { oficinaService } from '../services/oficinaService.js';
import {
  validarLoginInput,
  validarOrcamentoInput,
  validarAgendamentoInput,
  validarAtualizacaoOsInput,
  validarLgpdInput
} from '../validators/schemas.js';

const idempotencyCache = new Map();

export const oficinaController = {
  login(req, res, next) {
    try {
      const cred = validarLoginInput(req.body);
      const resultado = oficinaService.autenticar(cred);
      res.cookie('mastercar_session', resultado.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/'
      });
      res.json(resultado);
    } catch (err) {
      next(err);
    }
  },

  logout(_req, res) {
    res.clearCookie('mastercar_session', { path: '/' });
    res.json({ sucesso: true });
  },

  listarServicos(req, res, next) {
    try {
      res.json(oficinaService.listarServicos(req.query));
    } catch (err) {
      next(err);
    }
  },

  calcularOrcamento(req, res, next) {
    try {
      const validado = validarOrcamentoInput(req.body);
      if (validado.isBotHoneypot) return res.json({ bloqueadoSilenciosamente: true });
      res.json(oficinaService.calcularOrcamentoPreventivo(validado));
    } catch (err) {
      next(err);
    }
  },

  consultarOsPublica(req, res, next) {
    try {
      const termo = req.query.placa || req.query.termo || '';
      res.json(oficinaService.consultarOrdemPorPlacaOuProtocolo(termo));
    } catch (err) {
      next(err);
    }
  },

  listarOrdensAdmin(_req, res, next) {
    try {
      res.json(oficinaService.listarTodasOrdens());
    } catch (err) {
      next(err);
    }
  },

  atualizarOrdemAdmin(req, res, next) {
    try {
      const dados = validarAtualizacaoOsInput(req.body);
      res.json(oficinaService.atualizarOrdem(req.params.id, dados));
    } catch (err) {
      next(err);
    }
  },

  criarAgendamento(req, res, next) {
    try {
      const idempKey = req.headers['idempotency-key'];
      if (idempKey && idempotencyCache.has(idempKey)) {
        return res.status(200).json(idempotencyCache.get(idempKey));
      }

      const validado = validarAgendamentoInput(req.body);
      if (validado.isBotHoneypot) {
        return res.status(201).json({ protocolo: 'MTC-BOT-0000', mensagem: 'Recebido.' });
      }
      const criado = oficinaService.criarAgendamento(validado);
      if (idempKey) idempotencyCache.set(idempKey, criado);
      res.status(201).json(criado);
    } catch (err) {
      next(err);
    }
  },

  listarAgendamentosAdmin(_req, res, next) {
    try {
      res.json(oficinaService.listarAgendamentos());
    } catch (err) {
      next(err);
    }
  },

  criarSolicitacaoLgpd(req, res, next) {
    try {
      const dados = validarLgpdInput(req.body);
      res.status(201).json(oficinaService.registrarLgpd(dados));
    } catch (err) {
      next(err);
    }
  }
};
