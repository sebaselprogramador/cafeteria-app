const { query } = require('../config/db');

// Convierte filas clave/valor en un objeto { clave: valor }
const aObjeto = (filas) => Object.fromEntries(filas.map((f) => [f.clave, f.valor]));

// Modelo: datos generales del local (nombre, dirección, teléfono, horario, textos de portada)
async function obtenerConfiguracion() {
  return aObjeto(await query('SELECT clave, valor FROM configuracion'));
}

// Modelo: textos de la interfaz (botones, etiquetas, mensajes)
async function obtenerTextos() {
  return aObjeto(await query('SELECT clave, valor FROM textos'));
}

async function obtenerTexto(clave) {
  const filas = await query('SELECT valor FROM textos WHERE clave = ?', [clave]);
  return filas[0]?.valor ?? '';
}

// Modelo: páginas del menú
async function obtenerPaginas() {
  const filas = await query(
    `SELECT ruta, etiqueta_menu AS etiquetaMenu, titulo, descripcion, resumen,
            mostrar_en_inicio AS mostrarEnInicio
     FROM paginas WHERE visible = 1 ORDER BY orden, id`
  );
  return filas.map((p) => ({ ...p, mostrarEnInicio: Boolean(p.mostrarEnInicio) }));
}

// Modelo: video en bucle para la página de Inicio
async function obtenerVideos() {
  return query(
    'SELECT id, titulo, url_video AS urlVideo, url_poster AS urlPoster, fuente FROM videos_inicio WHERE activo = 1 ORDER BY id LIMIT 1'
  );
}

module.exports = { obtenerConfiguracion, obtenerTextos, obtenerTexto, obtenerPaginas, obtenerVideos };
