// Cliente HTTP para Ollama (servidor local con el modelo gemma3)
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'gemma3';
// La primera respuesta carga gemma3 en memoria y puede tardar más de un minuto en CPU
const TIMEOUT_MS = Number(process.env.OLLAMA_TIMEOUT_MS) || 180000;
// Cuánto tiempo mantiene Ollama el modelo en memoria después de usarlo
const KEEP_ALIVE = process.env.OLLAMA_KEEP_ALIVE || '2h';

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
        keep_alive: KEEP_ALIVE,
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

// Carga el modelo en memoria al arrancar el servidor, para que el primer
// mensaje del chat no tenga que esperar la carga de gemma3 (puede tardar más de un minuto)
async function precalentarModelo() {
  try {
    const inicio = Date.now();
    const respuesta = await conTimeout(`${OLLAMA_HOST}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: OLLAMA_MODEL, prompt: '', keep_alive: KEEP_ALIVE }),
    });
    if (!respuesta.ok) throw new Error(`estado ${respuesta.status}`);
    console.log(`[chatbot] ${OLLAMA_MODEL} cargado en memoria (${Math.round((Date.now() - inicio) / 1000)} s)`);
  } catch (error) {
    console.warn(`[chatbot] No se pudo precargar ${OLLAMA_MODEL}: ${error.message}`);
  }
}

module.exports = { chatConOllama, estadoOllama, precalentarModelo, OLLAMA_MODEL };
