// Cliente HTTP para Ollama (servidor local con el modelo gemma3)
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'gemma3';
// La primera respuesta carga gemma3 en memoria y puede tardar más de un minuto en CPU
const TIMEOUT_MS = Number(process.env.OLLAMA_TIMEOUT_MS) || 180000;

async function conTimeout(url, opciones) {
  const controlador = new AbortController();
  const timer = setTimeout(() => controlador.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...opciones, signal: controlador.signal });
  } finally {
    clearTimeout(timer);
  }
}

// Envía el historial a /api/chat de Ollama y devuelve el texto de respuesta
async function chatConOllama(mensajes) {
  let respuesta;
  try {
    respuesta = await conTimeout(`${OLLAMA_HOST}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: mensajes,
        stream: false,
        keep_alive: '30m',
        options: { temperature: 0.4, num_predict: 400 },
      }),
    });
  } catch (error) {
    const esTimeout = error.name === 'AbortError';
    const err = new Error(
      esTimeout
        ? `Ollama tardó más de ${TIMEOUT_MS / 1000} s en responder`
        : 'No se pudo conectar con Ollama. ¿Está ejecutándose?'
    );
    err.status = esTimeout ? 504 : 503;
    err.causa = error.message;
    throw err;
  }

  if (!respuesta.ok) {
    const err = new Error(`Ollama respondió con estado ${respuesta.status}`);
    err.status = 502;
    throw err;
  }

  const datos = await respuesta.json();
  return datos.message?.content?.trim() || '';
}

// Comprueba que Ollama esté disponible y que el modelo esté descargado
async function estadoOllama() {
  try {
    const respuesta = await conTimeout(`${OLLAMA_HOST}/api/tags`, {});
    if (!respuesta.ok) return { disponible: false, modelo: OLLAMA_MODEL };
    const datos = await respuesta.json();
    const modelos = (datos.models || []).map((m) => m.name);
    const modeloListo = modelos.some((n) => n === OLLAMA_MODEL || n.startsWith(`${OLLAMA_MODEL}:`));
    return { disponible: true, modelo: OLLAMA_MODEL, modeloListo };
  } catch {
    return { disponible: false, modelo: OLLAMA_MODEL };
  }
}

module.exports = { chatConOllama, estadoOllama, OLLAMA_MODEL };
