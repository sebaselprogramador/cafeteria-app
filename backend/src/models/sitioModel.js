const { query } = require('../config/db');

// Modelo: configuración general (nombre, dirección, teléfono, horario, textos de Inicio)
async function obtenerConfiguracion() {
  const filas = await query('SELECT clave, valor FROM configuracion');
  return Object.fromEntries(filas.map((f) => [f.clave, f.valor]));
}

// Modelo: videos en bucle para la página de Inicio
async function obtenerVideos() {
  return query(
    'SELECT id, titulo, url_video AS urlVideo, url_poster AS urlPoster, fuente FROM videos_inicio WHERE activo = 1 ORDER BY id LIMIT 1'
  );
}

module.exports = { obtenerConfiguracion, obtenerVideos };
