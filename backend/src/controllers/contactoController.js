const { guardarContacto } = require('../models/contactoModel');

// POST /api/contactos
async function crearContacto(req, res, next) {
  try {
    const id = await guardarContacto(req.body);
    res.status(201).json({ id, mensaje: 'Gracias por escribirnos. Te responderemos pronto.' });
  } catch (error) {
    next(error);
  }
}

module.exports = { crearContacto };
