const { query } = require('../config/db');

// Modelo: historial de conversaciones del chatbot
async function guardarMensaje(sesionId, rol, contenido) {
  await query(
    'INSERT INTO chat_mensajes (sesion_id, rol, contenido) VALUES (?, ?, ?)',
    [sesionId, rol, contenido]
  );
}

// Últimos N mensajes de una sesión, en orden cronológico
async function obtenerHistorial(sesionId, limite = 10) {
  const filas = await query(
    `SELECT rol, contenido FROM chat_mensajes
     WHERE sesion_id = ? ORDER BY id DESC LIMIT ${Number(limite) | 0}`,
    [sesionId]
  );
  return filas.reverse();
}

module.exports = { guardarMensaje, obtenerHistorial };
