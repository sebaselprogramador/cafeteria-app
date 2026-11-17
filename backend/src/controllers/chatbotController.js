const { responderMensaje } = require('../chatbot/chatbotService');
const { estadoOllama, OLLAMA_MODEL } = require('../chatbot/ollamaClient');

// POST /api/chatbot  → { sesionId, mensaje }
async function enviarMensaje(req, res, next) {
  try {
    const { sesionId, mensaje } = req.body;
    const respuesta = await responderMensaje(sesionId, mensaje);
    res.json({ respuesta, modelo: OLLAMA_MODEL });
  } catch (error) {
    next(error);
  }
}

// GET /api/chatbot/estado  → ¿Ollama y gemma3 listos?
async function estado(req, res) {
  res.json(await estadoOllama());
}

module.exports = { enviarMensaje, estado };
