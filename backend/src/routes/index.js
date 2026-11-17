const { Router } = require('express');
const sitio = require('../controllers/sitioController');
const contacto = require('../controllers/contactoController');
const chatbot = require('../controllers/chatbotController');
const reserva = require('../controllers/reservaController');
const { validarContacto } = require('../middleware/validarContacto');
const { validarConsultaMesas, validarReserva } = require('../middleware/validarReserva');

const router = Router();

router.get('/health', (req, res) => res.json({ ok: true }));

// Contenido de cada página del frontend
router.get('/inicio', sitio.inicio);
router.get('/sitio', sitio.datosSitio);
router.get('/servicios', sitio.servicios);
router.get('/especialidades', sitio.especialidades);
router.get('/nosotros', sitio.nosotros);
router.get('/precios', sitio.precios);

// Formulario de Contactos
router.post('/contactos', validarContacto, contacto.crearContacto);

// Zonas de mesas y reservas
router.get('/mesas', validarConsultaMesas, reserva.listarMesas);
router.post('/reservas', validarReserva, reserva.reservar);

// Chatbot (Ollama + gemma3)
router.post('/chatbot', chatbot.enviarMensaje);
router.get('/chatbot/estado', chatbot.estado);

module.exports = router;
