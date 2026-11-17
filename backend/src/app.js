const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

// Configuración de la aplicación Express (sin levantar el servidor)
const app = express();

app.disable('x-powered-by');

app.use(
  cors({
    origin: (process.env.CORS_ORIGIN || 'http://localhost:4200').split(',').map((o) => o.trim()),
  })
);
app.use(express.json({ limit: '100kb' }));

app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
