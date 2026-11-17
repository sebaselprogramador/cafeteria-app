const { Router } = require('express');
const sitio = require('../controllers/sitioController');
const contacto = require('../controllers/contactoController');
const chatbot = require('../controllers/chatbotController');
const { validarContacto } = require('../middleware/validarContacto');

const router = Router();

router.get('/health', (req, res) => res.json({ ok: true }));

// Contenido de cada página del frontend
router.get('/inicio', sitio.inicio);
router.get('/configuracion', sitio.configuracion);
router.get('/servicios', sitio.servicios);
router.get('/especialidades', sitio.especialidades);
router.get('/nosotros', sitio.nosotros);
router.get('/precios', sitio.precios);

// Formulario de Contactos
router.post('/contactos', validarContacto, contacto.crearContacto);

// Chatbot (Ollama + gemma3)
router.post('/chatbot', chatbot.enviarMensaje);
router.get('/chatbot/estado', chatbot.estado);

module.exports = router;
