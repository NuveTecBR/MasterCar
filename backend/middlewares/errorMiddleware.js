export function notFoundHandler(req, res) {
  res.status(404).json({ erro: `Rota não encontrada: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || 500;
  const isProd = process.env.NODE_ENV === 'production';

  res.status(statusCode).json({
    erro: statusCode === 500 && isProd
      ? 'Erro interno no servidor MasterCar. Tente novamente em instantes.'
      : (err.message || 'Erro inesperado.')
  });
}
