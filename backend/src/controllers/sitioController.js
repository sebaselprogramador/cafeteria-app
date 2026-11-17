const sitio = require('../models/sitioModel');
const catalogo = require('../models/catalogoModel');

// GET /api/inicio  → video en bucle + textos de portada
async function inicio(req, res, next) {
  try {
    const [configuracion, videos] = await Promise.all([
      sitio.obtenerConfiguracion(),
      sitio.obtenerVideos(),
    ]);
    res.json({
      nombre: configuracion.nombre,
      slogan: configuracion.slogan,
      heroTitulo: configuracion.hero_titulo,
      heroSubtitulo: configuracion.hero_subtitulo,
      video: videos[0] || null,
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/configuracion  → datos de contacto y del local (footer, contactos)
async function configuracion(req, res, next) {
  try {
    const datos = await sitio.obtenerConfiguracion();
    res.json({
      nombre: datos.nombre,
      slogan: datos.slogan,
      direccion: datos.direccion,
      telefono: datos.telefono,
      email: datos.email,
      horario: datos.horario,
      moneda: datos.moneda,
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/servicios
async function servicios(req, res, next) {
  try {
    res.json(await catalogo.obtenerServicios());
  } catch (error) {
    next(error);
  }
}

// GET /api/especialidades
async function especialidades(req, res, next) {
  try {
    res.json(await catalogo.obtenerEspecialidades());
  } catch (error) {
    next(error);
  }
}

// GET /api/nosotros  → historia, fotos y datos de contacto
async function nosotros(req, res, next) {
  try {
    const [secciones, fotos, datos] = await Promise.all([
      catalogo.obtenerSeccionesNosotros(),
      catalogo.obtenerFotosTienda(),
      sitio.obtenerConfiguracion(),
    ]);
    res.json({
      secciones,
      fotos,
      direccion: datos.direccion,
      telefono: datos.telefono,
      horario: datos.horario,
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/precios  → agrupados por categoría
async function precios(req, res, next) {
  try {
    const filas = await catalogo.obtenerPrecios();
    const agrupados = {};
    for (const fila of filas) {
      if (!agrupados[fila.categoria]) agrupados[fila.categoria] = [];
      agrupados[fila.categoria].push({
        id: fila.id,
        nombre: fila.nombre,
        descripcion: fila.descripcion,
        precio: Number(fila.precio),
        moneda: fila.moneda,
      });
    }
    res.json(
      Object.entries(agrupados).map(([categoria, items]) => ({ categoria, items }))
    );
  } catch (error) {
    next(error);
  }
}

module.exports = { inicio, configuracion, servicios, especialidades, nosotros, precios };
