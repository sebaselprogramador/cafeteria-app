const { guardarContacto } = require('../models/contactoModel');
const { obtenerTexto } = require('../models/sitioModel');

// POST /api/contactos  → guarda el mensaje y responde con el texto de éxito de la base de datos
async function crearContacto(req, res, next) {
  try {
    const id = await guardarContacto(req.body);
    const mensaje = await obtenerTexto('form_exito');
    res.status(201).json({ id, mensaje });
  } catch (error) {
    next(error);
  }
}

module.exports = { crearContacto };
