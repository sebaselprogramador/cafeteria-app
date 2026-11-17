// Valida el cuerpo de POST /api/contactos antes de llegar al controlador
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validarContacto(req, res, next) {
  const { nombre, email, telefono, asunto, mensaje } = req.body || {};
  const errores = [];

  if (typeof nombre !== 'string' || nombre.trim().length < 2 || nombre.length > 120) {
    errores.push('El nombre debe tener entre 2 y 120 caracteres.');
  }
  if (typeof email !== 'string' || !EMAIL_REGEX.test(email) || email.length > 150) {
    errores.push('El correo electrónico no es válido.');
  }
  if (telefono !== undefined && telefono !== '' && (typeof telefono !== 'string' || telefono.length > 30)) {
    errores.push('El teléfono no es válido.');
  }
  if (asunto !== undefined && asunto !== '' && (typeof asunto !== 'string' || asunto.length > 150)) {
    errores.push('El asunto es demasiado largo.');
  }
  if (typeof mensaje !== 'string' || mensaje.trim().length < 5 || mensaje.length > 2000) {
    errores.push('El mensaje debe tener entre 5 y 2000 caracteres.');
  }

  if (errores.length) {
    return res.status(400).json({ error: 'Datos inválidos', detalles: errores });
  }

  req.body = {
    nombre: nombre.trim(),
    email: email.trim(),
    telefono: telefono ? telefono.trim() : '',
    asunto: asunto ? asunto.trim() : '',
    mensaje: mensaje.trim(),
  };
  next();
}

module.exports = { validarContacto };
