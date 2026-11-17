const { pool, query } = require('../config/db');

// Error de negocio con un código que el frontend traduce con la tabla `textos`
// (reserva_error_<codigo>).
function errorReserva(codigo, status) {
  const err = new Error(`Reserva rechazada: ${codigo}`);
  err.codigo = codigo;
  err.status = status;
  return err;
}

// Condición SQL: dos reservas de la misma mesa se pisan si sus horas
// están a menos de `duración` minutos de distancia.
const SE_SOLAPA = "estado <> 'cancelada' AND ABS(TIME_TO_SEC(hora) - TIME_TO_SEC(?)) < ?";

// Modelo: zonas con sus mesas. Si llegan fecha y hora, marca cada mesa como disponible o no.
async function obtenerZonasConMesas(fecha, hora, duracionMin) {
  const [zonas, mesas] = await Promise.all([
    query('SELECT id, nombre, descripcion, icono FROM zonas_mesas WHERE activo = 1 ORDER BY orden, id'),
    query('SELECT id, zona_id AS zonaId, codigo, capacidad, forma FROM mesas WHERE activo = 1 ORDER BY orden, id'),
  ]);

  let ocupadas = null;
  if (fecha && hora) {
    const filas = await query(
      `SELECT DISTINCT mesa_id AS mesaId FROM reservas WHERE fecha = ? AND ${SE_SOLAPA}`,
      [fecha, hora, duracionMin * 60]
    );
    ocupadas = new Set(filas.map((f) => f.mesaId));
  }

  return zonas.map((zona) => ({
    ...zona,
    mesas: mesas
      .filter((m) => m.zonaId === zona.id)
      .map(({ zonaId, ...mesa }) => ({
        ...mesa,
        disponible: ocupadas ? !ocupadas.has(mesa.id) : null,
      })),
  }));
}

// Modelo: crea una reserva dentro de una transacción.
// El SELECT ... FOR UPDATE bloquea la mesa para que dos personas no la reserven a la vez.
async function crearReserva(datos, duracionMin) {
  const conexion = await pool.getConnection();
  try {
    await conexion.beginTransaction();

    const [mesas] = await conexion.execute(
      'SELECT id, capacidad FROM mesas WHERE id = ? AND activo = 1 FOR UPDATE',
      [datos.mesaId]
    );
    if (!mesas.length) throw errorReserva('mesa', 404);
    if (mesas[0].capacidad < datos.personas) throw errorReserva('capacidad', 400);

    const [choques] = await conexion.execute(
      `SELECT id FROM reservas WHERE mesa_id = ? AND fecha = ? AND ${SE_SOLAPA}`,
      [datos.mesaId, datos.fecha, datos.hora, duracionMin * 60]
    );
    if (choques.length) throw errorReserva('ocupada', 409);

    const [resultado] = await conexion.execute(
      `INSERT INTO reservas (mesa_id, nombre, email, telefono, fecha, hora, personas, comentario)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        datos.mesaId,
        datos.nombre,
        datos.email,
        datos.telefono || null,
        datos.fecha,
        datos.hora,
        datos.personas,
        datos.comentario || null,
      ]
    );

    await conexion.commit();
    return resultado.insertId;
  } catch (error) {
    await conexion.rollback();
    throw error;
  } finally {
    conexion.release();
  }
}

module.exports = { obtenerZonasConMesas, crearReserva, errorReserva };
