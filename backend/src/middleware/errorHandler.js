// 404 para rutas de la API que no existen
function notFound(req, res) {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
}

// Manejador global de errores. No expone detalles internos al cliente.
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  if (status >= 500) {
    console.error('[error]', err.message, err.causa || '');
  }
  res.status(status).json({
    error: status >= 500 ? 'Error interno del servidor' : err.message,
  });
}

module.exports = { notFound, errorHandler };
