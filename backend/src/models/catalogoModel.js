const { query } = require('../config/db');

// Modelo: servicios, especialidades, nosotros (historia + fotos) y precios
async function obtenerServicios() {
  return query(
    'SELECT id, nombre, descripcion, icono FROM servicios WHERE activo = 1 ORDER BY orden, id'
  );
}

async function obtenerEspecialidades() {
  return query(
    'SELECT id, nombre, descripcion, imagen_url AS imagenUrl FROM especialidades WHERE activo = 1 ORDER BY orden, id'
  );
}

async function obtenerSeccionesNosotros() {
  return query('SELECT id, titulo, contenido FROM nosotros_secciones ORDER BY orden, id');
}

async function obtenerFotosTienda() {
  return query(
    'SELECT id, imagen_url AS imagenUrl, descripcion FROM fotos_tienda ORDER BY orden, id'
  );
}

async function obtenerPrecios() {
  return query(
    'SELECT id, categoria, nombre, descripcion, precio, moneda FROM precios WHERE activo = 1 ORDER BY categoria, orden, id'
  );
}

module.exports = {
  obtenerServicios,
  obtenerEspecialidades,
  obtenerSeccionesNosotros,
  obtenerFotosTienda,
  obtenerPrecios,
};
