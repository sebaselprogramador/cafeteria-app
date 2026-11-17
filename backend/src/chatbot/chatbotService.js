const { chatConOllama } = require('./ollamaClient');
const { obtenerConfiguracion, obtenerTexto } = require('../models/sitioModel');
const { obtenerServicios, obtenerPrecios, obtenerEspecialidades } = require('../models/catalogoModel');
const { guardarMensaje, obtenerHistorial } = require('../models/chatModel');
const { obtenerZonasConMesas } = require('../models/reservaModel');

// Construye el contexto del local a partir de la base de datos.
// Así el bot responde solo con información real de la cafetería.
async function construirPromptSistema() {
  const [config, instrucciones, infoReservas, servicios, especialidades, precios, zonas] = await Promise.all([
    obtenerConfiguracion(),
    obtenerTexto('chatbot_instrucciones'),
    obtenerTexto('chatbot_info_reservas'),
    obtenerServicios(),
    obtenerEspecialidades(),
    obtenerPrecios(),
    obtenerZonasConMesas(null, null, 0),
  ]);

  // Las instrucciones de comportamiento vienen de la tabla `textos`;
  // los datos del local, de `configuracion`, `servicios`, `especialidades` y `precios`.
  return [
    `Asistente virtual de: ${config.nombre}`,
    instrucciones,
    '',
    `Dirección: ${config.direccion}`,
    `Teléfono: ${config.telefono}`,
    `Correo: ${config.email}`,
    `Horario: ${config.horario}`,
    '',
    'Servicios:',
    ...servicios.map((s) => `- ${s.nombre}: ${s.descripcion || ''}`),
    '',
    'Especialidades:',
    ...especialidades.map((e) => `- ${e.nombre}: ${e.descripcion || ''}`),
    '',
    'Precios:',
    ...precios.map((p) => `- ${p.categoria}: ${p.nombre} (${p.descripcion || ''}) ${p.precio} ${p.moneda}`),
    '',
    'Zonas de mesas:',
    ...zonas.map((z) => {
      const caps = z.mesas.map((m) => m.capacidad);
      const rango = caps.length ? `${Math.min(...caps)} a ${Math.max(...caps)} personas` : 'sin mesas';
      return `- ${z.nombre}: ${z.mesas.length} mesas (${rango}). ${z.descripcion || ''}`;
    }),
    infoReservas,
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
