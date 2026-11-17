-- Datos de ejemplo. Ejecutar DESPUÉS de schema.sql
-- Todo el contenido visible del frontend sale de estas tablas.
USE cafeteria_db;

SET NAMES utf8mb4;

-- Limpia datos de ejemplo previos (no toca contactos ni chat_mensajes).
-- OJO: también borra las reservas, porque dependen de las mesas de ejemplo.
DELETE FROM reservas;
DELETE FROM mesas;
DELETE FROM zonas_mesas;
DELETE FROM configuracion;
DELETE FROM textos;
DELETE FROM paginas;
DELETE FROM videos_inicio;
DELETE FROM servicios;
DELETE FROM especialidades;
DELETE FROM nosotros_secciones;
DELETE FROM fotos_tienda;
DELETE FROM precios;

-- ---------------------------------------------------------------
-- Datos del local
-- ---------------------------------------------------------------
INSERT INTO configuracion (clave, valor) VALUES
  ('nombre',            'Café Don Richard'),
  ('slogan',            'Café de origen, hecho con calma'),
  ('icono',             '☕'),
  ('hero_titulo',       'Bienvenido a Café Don Richard'),
  ('hero_subtitulo',    'Granos seleccionados, repostería casera y un lugar para quedarte un rato.'),
  ('hero_imagen',       '/assets/portada.jpg'),
  ('hero_imagen_alt',   'Barista de Café Don Richard con una jarra de leche junto a la máquina de espresso'),
  ('direccion',         'Av. Principal #123, Zona Centro, Ciudad'),
  ('telefono',          '+591 70000000'),
  ('email',             'hola@cafedonrichard.example'),
  ('horario',           'Lunes a viernes 07:00 - 21:00 · Sábados y domingos 08:00 - 22:00'),
  ('moneda',            'Bs'),
  -- Reglas de reservas
  ('reserva_hora_apertura',  '08:00'),
  ('reserva_hora_cierre',    '20:30'),
  ('reserva_intervalo_min',  '30'),
  ('reserva_duracion_min',   '90'),
  ('reserva_dias_max',       '60'),
  ('reserva_personas_max',   '12');

-- ---------------------------------------------------------------
-- Páginas del menú (la ruta '' es Inicio)
-- ---------------------------------------------------------------
INSERT INTO paginas (ruta, etiqueta_menu, titulo, descripcion, resumen, mostrar_en_inicio, orden, visible) VALUES
  ('',               'Inicio',         'Inicio',             NULL, NULL, 0, 1, 1),
  ('servicios',      'Servicios',      'Nuestros servicios', 'Todo lo que puedes disfrutar en Café Don Richard, desde tu primer café del día.', 'Lo que ofrecemos cada día.', 1, 2, 1),
  ('especialidades', 'Especialidades', 'Especialidades',     'Las preparaciones que nos hacen únicos.', 'Nuestras bebidas y postres favoritos.', 1, 3, 1),
  ('nosotros',       'Nosotros',       'Nosotros',           'Conoce nuestra historia, dónde estamos y cómo es el local.', 'Historia, dirección y fotos del local.', 1, 4, 1),
  ('precios',        'Precios',        'Precios',            'Precios referenciales. Pueden variar según disponibilidad.', 'Consulta la carta completa.', 0, 5, 1),
  ('reservas',       'Reservas',       'Reserva tu mesa',    'Elige el día, la hora y tu mesa favorita en cualquiera de nuestras zonas.', 'Elige tu mesa y reserva en línea.', 1, 6, 1),
  ('contactos',      'Contactos',      'Contactos',          '¿Tienes una consulta, quieres organizar un evento o tienes una sugerencia? Escríbenos.', 'Escríbenos.', 0, 7, 1);

-- ---------------------------------------------------------------
-- Textos de la interfaz
-- ---------------------------------------------------------------
INSERT INTO textos (clave, valor) VALUES
  -- Generales
  ('cargando',                  'Cargando…'),
  ('vacio',                     'Aún no hay información publicada.'),
  ('error_carga',               'No se pudo cargar esta sección.'),
  ('menu_abrir',                'Abrir menú'),
  ('footer_derechos',           'Todos los derechos reservados.'),
  -- Inicio
  ('hero_boton_primario',       'Ver precios'),
  ('hero_boton_primario_ruta',  '/precios'),
  ('hero_boton_secundario',     'Reservar mesa'),
  ('hero_boton_secundario_ruta','/reservas'),
  -- Nosotros
  ('nosotros_visita_titulo',    'Visítanos'),
  ('nosotros_galeria_titulo',   'Fotos de la tienda'),
  ('etiqueta_direccion',        'Dirección'),
  ('etiqueta_telefono',         'Teléfono'),
  ('etiqueta_email',            'Correo'),
  ('etiqueta_horario',          'Horario'),
  -- Contactos
  ('contacto_aside_titulo',     'También puedes visitarnos'),
  ('contacto_aside_texto',      'Te esperamos con café recién preparado. Si llegas con un grupo, avísanos y reservamos tu mesa. Para pedidos especiales o eventos privados, escríbenos con anticipación.'),
  ('form_nombre',               'Nombre *'),
  ('form_email',                'Correo electrónico *'),
  ('form_telefono',             'Teléfono'),
  ('form_asunto',               'Asunto'),
  ('form_mensaje',              'Mensaje *'),
  ('form_boton',                'Enviar mensaje'),
  ('form_enviando',             'Enviando…'),
  ('form_exito',                'Gracias por escribirnos. Te responderemos pronto.'),
  ('form_error_nombre',         'Ingresa tu nombre (mínimo 2 caracteres).'),
  ('form_error_email',          'Ingresa un correo válido.'),
  ('form_error_mensaje',        'El mensaje debe tener al menos 5 caracteres.'),
  ('form_error_envio',          'No se pudo enviar el mensaje. Intenta más tarde.'),
  -- Reservas
  ('reserva_paso1',               '1. Elige día, hora y personas'),
  ('reserva_paso2',               '2. Elige tu mesa'),
  ('reserva_paso3',               '3. Completa tus datos'),
  ('reserva_fecha',               'Fecha'),
  ('reserva_hora',                'Hora'),
  ('reserva_personas',            'Personas'),
  ('reserva_mesa',                'Mesa'),
  ('reserva_capacidad',           'pers.'),
  ('reserva_leyenda_libre',       'Disponible'),
  ('reserva_leyenda_ocupada',     'Ocupada'),
  ('reserva_leyenda_pequena',     'Muy pequeña'),
  ('reserva_leyenda_seleccionada','Tu elección'),
  ('reserva_sin_horarios',        'No quedan horarios disponibles para este día. Elige otra fecha.'),
  ('reserva_sin_mesa',            'Selecciona una mesa disponible en el plano.'),
  ('reserva_resumen',             'Vas a reservar'),
  ('reserva_comentario',          'Comentario (opcional)'),
  ('reserva_boton',               'Confirmar reserva'),
  ('reserva_enviando',            'Reservando…'),
  ('reserva_exito',               '¡Reserva confirmada! Te esperamos.'),
  ('reserva_error',               'No se pudo registrar la reserva. Intenta de nuevo.'),
  ('reserva_error_ocupada',       'Esa mesa acaba de ser reservada para ese horario. Elige otra.'),
  ('reserva_error_capacidad',     'La mesa elegida no tiene lugar para tantas personas.'),
  ('reserva_error_fecha',         'La fecha elegida no está disponible para reservas.'),
  ('reserva_error_horario',       'La hora elegida está fuera del horario de reservas.'),
  ('reserva_error_mesa',          'La mesa elegida ya no existe.'),
  ('reserva_error_datos',         'Revisa los datos del formulario.'),
  -- Chatbot
  ('chatbot_info_reservas',     'Las reservas de mesa se hacen en la sección Reservas de la web, eligiendo día, hora y mesa.'),
  ('chatbot_titulo',            'Asistente del café'),
  ('chatbot_saludo',            'Hola, soy el asistente de Café Don Richard. ¿Qué te gustaría saber?'),
  ('chatbot_placeholder',       'Pregunta por precios, horarios…'),
  ('chatbot_boton',             'Enviar'),
  ('chatbot_escribiendo',       'Escribiendo…'),
  ('chatbot_no_disponible',     'Asistente no disponible'),
  ('chatbot_error',             'No pude responder en este momento. Intenta de nuevo.'),
  ('chatbot_instrucciones',     'Responde siempre en español, de forma breve, amable y clara. Usa únicamente la información de este contexto. Si no sabes algo, di que no tienes ese dato y sugiere contactar al local.');

-- ---------------------------------------------------------------
-- Contenido de cada sección
-- ---------------------------------------------------------------
-- Video de fondo: desactivado (activo = 0) hasta poner un MP4 real de Pexels y cambiar activo a 1
INSERT INTO videos_inicio (titulo, url_video, url_poster, fuente, activo) VALUES
  ('Cafetería acogedora', 'https://REEMPLAZAR-con-mp4-de-pexels.mp4', NULL, 'https://www.pexels.com/', 0);

INSERT INTO servicios (nombre, descripcion, icono, orden, activo) VALUES
  ('Cafetería de especialidad', 'Espresso, filtrados y métodos manuales con granos de origen.', '☕', 1, 1),
  ('Desayunos y brunch',        'Opciones dulces y saladas servidas desde las 07:00.',          '🌤️', 2, 1),
  ('Repostería casera',         'Tortas, croissants y galletas horneados cada mañana.',         '🍰', 3, 1),
  ('Eventos privados',          'Reuniones y celebraciones pequeñas con reserva previa.',       '👥', 4, 1),
  ('Pedidos para llevar',       'Pide tu café o combo y recógelo en minutos.',                  '🛍️', 5, 1),
  ('Wi-Fi y espacio de trabajo','Mesas tranquilas y conexión estable para trabajar o estudiar.', '💻', 6, 1);

INSERT INTO especialidades (nombre, descripcion, imagen_url, orden, activo) VALUES
  ('Latte de vainilla',       'Espresso doble, leche texturizada y vainilla natural.',       '/assets/placeholder.svg', 1, 1),
  ('Cold brew de la casa',    'Infusión en frío de 18 horas, servido con hielo y naranja.', '/assets/placeholder.svg', 2, 1),
  ('Croissant de mantequilla','Laminado a mano, horneado en el momento.',                    '/assets/placeholder.svg', 3, 1),
  ('Chocolate abuela',        'Chocolate espeso con canela, a la antigua.',                  '/assets/placeholder.svg', 4, 1);

INSERT INTO nosotros_secciones (titulo, contenido, orden) VALUES
  ('Nuestra historia', 'Café Don Richard nació en 2015 como un pequeño puesto de café de origen. Hoy seguimos tostando en lotes pequeños y trabajando directamente con productores.', 1),
  ('Nuestra misión',   'Ofrecer un café honesto, bien preparado y un espacio cálido para compartir.', 2);

INSERT INTO fotos_tienda (imagen_url, descripcion, orden) VALUES
  ('/assets/placeholder.svg', 'Barra de café',         1),
  ('/assets/placeholder.svg', 'Salón principal',       2),
  ('/assets/placeholder.svg', 'Vitrina de repostería', 3);

-- Zonas de mesas y mesas (ids fijos para poder referenciarlas abajo)
INSERT INTO zonas_mesas (id, nombre, descripcion, icono, orden, activo) VALUES
  (1, 'Salón principal', 'El corazón del café: luz cálida y aroma a recién molido.', '🛋️', 1, 1),
  (2, 'Terraza',         'Al aire libre, ideal para mañanas soleadas.',             '🌿', 2, 1),
  (3, 'Barra',           'Junto a los baristas, perfecta para ir solo o en pareja.', '☕', 3, 1),
  (4, 'Sala privada',    'Para reuniones y celebraciones de grupo.',                 '🎉', 4, 1);

INSERT INTO mesas (zona_id, codigo, capacidad, forma, orden, activo) VALUES
  (1, 'S1', 2, 'redonda',  1, 1),
  (1, 'S2', 2, 'redonda',  2, 1),
  (1, 'S3', 4, 'cuadrada', 3, 1),
  (1, 'S4', 4, 'cuadrada', 4, 1),
  (1, 'S5', 4, 'cuadrada', 5, 1),
  (1, 'S6', 6, 'larga',    6, 1),
  (2, 'T1', 2, 'redonda',  1, 1),
  (2, 'T2', 4, 'cuadrada', 2, 1),
  (2, 'T3', 4, 'cuadrada', 3, 1),
  (2, 'T4', 6, 'larga',    4, 1),
  (3, 'B1', 1, 'redonda',  1, 1),
  (3, 'B2', 1, 'redonda',  2, 1),
  (3, 'B3', 2, 'redonda',  3, 1),
  (3, 'B4', 2, 'redonda',  4, 1),
  (4, 'P1', 12, 'larga',   1, 1);

INSERT INTO precios (categoria, nombre, descripcion, precio, moneda, orden, activo) VALUES
  ('Cafés calientes', 'Espresso',          'Shot simple',              10.00, 'Bs', 1, 1),
  ('Cafés calientes', 'Cappuccino',        'Espresso con espuma',      18.00, 'Bs', 2, 1),
  ('Cafés calientes', 'Latte',             'Espresso con leche',       20.00, 'Bs', 3, 1),
  ('Cafés fríos',     'Cold brew',         'Servido con hielo',        22.00, 'Bs', 1, 1),
  ('Cafés fríos',     'Frappé de moka',    'Batido con chocolate',     25.00, 'Bs', 2, 1),
  ('Repostería',      'Croissant',         'Mantequilla',              12.00, 'Bs', 1, 1),
  ('Repostería',      'Torta del día',     'Porción',                  15.00, 'Bs', 2, 1);
