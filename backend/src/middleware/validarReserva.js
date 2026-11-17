// Valida la forma de los datos de reservas. Las reglas de negocio
// (horario, días máximos, capacidad, mesa libre) se revisan en el controlador y el modelo.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FECHA_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const HORA_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

function rechazar(res) {
  return res.status(400).json({ error: 'Datos inválidos', codigo: 'datos' });
}

function fechaValida(fecha) {
  if (typeof fecha !== 'string' || !FECHA_REGEX.test(fecha)) return false;
  const d = new Date(`${fecha}T00:00:00`);
  return !Number.isNaN(d.getTime()) && d.toLocaleDateString('sv-SE') === fecha;
}

// GET /api/mesas?fecha=YYYY-MM-DD&hora=HH:MM (ambos opcionales, pero juntos)
function validarConsultaMesas(req, res, next) {
  const { fecha, hora } = req.query;
  if (!fecha && !hora) return next();
  if (!fechaValida(fecha) || typeof hora !== 'string' || !HORA_REGEX.test(hora)) return rechazar(res);
  next();
}

// POST /api/reservas
function validarReserva(req, res, next) {
  const { mesaId, nombre, email, telefono, fecha, hora, personas, comentario } = req.body || {};

  const valido =
    Number.isInteger(mesaId) && mesaId > 0 &&
    typeof nombre === 'string' && nombre.trim().length >= 2 && nombre.length <= 120 &&
    typeof email === 'string' && EMAIL_REGEX.test(email) && email.length <= 150 &&
    (telefono === undefined || telefono === '' || (typeof telefono === 'string' && telefono.length <= 30)) &&
    fechaValida(fecha) &&
    typeof hora === 'string' && HORA_REGEX.test(hora) &&
    Number.isInteger(personas) && personas >= 1 && personas <= 50 &&
    (comentario === undefined || comentario === '' || (typeof comentario === 'string' && comentario.length <= 500));

  if (!valido) return rechazar(res);

  req.body = {
    mesaId,
    nombre: nombre.trim(),
    email: email.trim(),
    telefono: telefono ? telefono.trim() : '',
    fecha,
    hora,
    personas,
    comentario: comentario ? comentario.trim() : '',
  };
  next();
}

module.exports = { validarConsultaMesas, validarReserva };
