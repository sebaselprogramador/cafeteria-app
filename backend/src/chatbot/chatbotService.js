const { chatConOllama } = require('./ollamaClient');
const { obtenerConfiguracion } = require('../models/sitioModel');
const { obtenerServicios, obtenerPrecios, obtenerEspecialidades } = require('../models/catalogoModel');
const { guardarMensaje, obtenerHistorial } = require('../models/chatModel');

// Construye el contexto del local a partir de la base de datos.
// Así el bot responde solo con información real de la cafetería.
async function construirPromptSistema() {
  const [config, servicios, especialidades, precios] = await Promise.all([
    obtenerConfiguracion(),
    obtenerServicios(),
    obtenerEspecialidades(),
    obtenerPrecios(),
  ]);

  const lineasPrecios = precios
    .map((p) => `- ${p.categoria}: ${p.nombre} (${p.descripcion || ''}) ${p.precio} ${p.moneda}`)
    .join('\n');

  return [
    `Eres el asistente virtual de ${config.nombre || 'la cafetería'}.`,
    'Responde siempre en español, de forma breve, amable y clara.',
    'Usa únicamente la información de este contexto. Si no sabes algo, di que no tienes ese dato y sugiere contactar al local.',
    '',
    `Dirección: ${config.direccion || 'No disponible'}`,
    `Teléfono: ${config.telefono || 'No disponible'}`,
    `Correo: ${config.email || 'No disponible'}`,
    `Horario: ${config.horario || 'No disponible'}`,
    '',
    'Servicios:',
    ...servicios.map((s) => `- ${s.nombre}: ${s.descripcion || ''}`),
    '',
    'Especialidades:',
    ...especialidades.map((e) => `- ${e.nombre}: ${e.descripcion || ''}`),
    '',
    'Precios:',
    lineasPrecios || '- Sin precios registrados',
  ].join('\n');
}

// Procesa un mensaje del usuario: guarda historial, consulta a Ollama y devuelve la respuesta
async function responderMensaje(sesionId, mensajeUsuario) {
  const prompt = await construirPromptSistema();
  const historial = await obtenerHistorial(sesionId, 10);

  const mensajes = [
    { role: 'system', content: prompt },
    ...historial.map((h) => ({ role: h.rol, content: h.contenido })),
    { role: 'user', content: mensajeUsuario },
  ];

  const respuesta = await chatConOllama(mensajes);

  await guardarMensaje(sesionId, 'user', mensajeUsuario);
  await guardarMensaje(sesionId, 'assistant', respuesta);

  return respuesta;
}

module.exports = { responderMensaje };
