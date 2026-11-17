const { obtenerConfiguracion, obtenerTexto } = require('../models/sitioModel');
const { obtenerZonasConMesas, crearReserva, errorReserva } = require('../models/reservaModel');

// Reglas de reservas guardadas en la tabla `configuracion`
async function reglas() {
  const c = await obtenerConfiguracion();
  return {
    apertura: c.reserva_hora_apertura || '08:00',
    cierre: c.reserva_hora_cierre || '20:00',
    duracion: Number(c.reserva_duracion_min) || 90,
    diasMax: Number(c.reserva_dias_max) || 60,
    personasMax: Number(c.reserva_personas_max) || 12,
  };
}

// Fecha y hora locales del servidor en formato YYYY-MM-DD / HH:MM
function ahoraLocal() {
  const ahora = new Date();
  return { fecha: ahora.toLocaleDateString('sv-SE'), hora: ahora.toTimeString().slice(0, 5) };
}

function sumarDias(fecha, dias) {
  const d = new Date(`${fecha}T00:00:00`);
  d.setDate(d.getDate() + dias);
  return d.toLocaleDateString('sv-SE');
}

// GET /api/mesas  → zonas con mesas; con ?fecha&hora incluye disponibilidad
async function listarMesas(req, res, next) {
  try {
    const { fecha, hora } = req.query;
    const { duracion } = await reglas();
    res.json(await obtenerZonasConMesas(fecha || null, hora || null, duracion));
  } catch (error) {
    next(error);
  }
}

// POST /api/reservas
async function reservar(req, res, next) {
  try {
    const r = await reglas();
    const hoy = ahoraLocal();
    const { fecha, hora, personas } = req.body;

    if (fecha < hoy.fecha || fecha > sumarDias(hoy.fecha, r.diasMax)) throw errorReserva('fecha', 400);
    if (hora < r.apertura || hora > r.cierre) throw errorReserva('horario', 400);
    if (fecha === hoy.fecha && hora <= hoy.hora) throw errorReserva('horario', 400);
    if (personas > r.personasMax) throw errorReserva('capacidad', 400);

    const id = await crearReserva(req.body, r.duracion);
    const mensaje = await obtenerTexto('reserva_exito');
    res.status(201).json({ id, mensaje });
  } catch (error) {
    next(error);
  }
}

module.exports = { listarMesas, reservar };
