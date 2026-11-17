const { query } = require('../config/db');

// Modelo: mensajes enviados desde el formulario de Contactos
async function guardarContacto({ nombre, email, telefono, asunto, mensaje }) {
  const resultado = await query(
    'INSERT INTO contactos (nombre, email, telefono, asunto, mensaje) VALUES (?, ?, ?, ?, ?)',
    [nombre, email, telefono || null, asunto || null, mensaje]
  );
  return resultado.insertId;
}

module.exports = { guardarContacto };
