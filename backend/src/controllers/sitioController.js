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
      heroImagen: configuracion.hero_imagen || null,
      heroImagenAlt: configuracion.hero_imagen_alt || '',
      video: videos[0] || null,
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/sitio  → datos del local, textos de la interfaz y páginas del menú
async function datosSitio(req, res, next) {
  try {
    const [configuracion, textos, paginas] = await Promise.all([
      sitio.obtenerConfiguracion(),
      sitio.obtenerTextos(),
      sitio.obtenerPaginas(),
    ]);
    res.json({ configuracion, textos, paginas });
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

module.exports = { inicio, datosSitio, servicios, especialidades, nosotros, precios };
