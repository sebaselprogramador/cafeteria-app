-- Datos de ejemplo. Ejecutar DESPUÉS de schema.sql
USE cafeteria_db;

-- Limpia datos de ejemplo previos (no toca contactos ni chat_mensajes)
DELETE FROM configuracion;
DELETE FROM videos_inicio;
DELETE FROM servicios;
DELETE FROM especialidades;
DELETE FROM nosotros_secciones;
DELETE FROM fotos_tienda;
DELETE FROM precios;

INSERT INTO configuracion (clave, valor) VALUES
  ('nombre',            'Café Aroma'),
  ('slogan',            'Café de origen, hecho con calma'),
  ('hero_titulo',       'Bienvenido a Café Aroma'),
  ('hero_subtitulo',    'Granos seleccionados, repostería casera y un lugar para quedarte un rato.'),
  ('direccion',         'Av. Principal #123, Zona Centro, Ciudad'),
  ('telefono',          '+591 70000000'),
  ('email',             'hola@cafearoma.example'),
  ('horario',           'Lunes a viernes 07:00 - 21:00 · Sábados y domingos 08:00 - 22:00'),
  ('moneda',            'Bs'),
  ('chatbot_saludo',    'Hola, soy el asistente de Café Aroma. ¿Qué te gustaría saber?');

INSERT INTO videos_inicio (titulo, url_video, url_poster, fuente, activo) VALUES
  ('Cafetería acogedora', 'https://REEMPLAZAR-con-mp4-de-pexels.mp4', NULL, 'https://www.pexels.com/', 1);

INSERT INTO servicios (nombre, descripcion, icono, orden, activo) VALUES
  ('Cafetería de especialidad', 'Espresso, filtrados y métodos manuales con granos de origen.', 'coffee', 1, 1),
  ('Desayunos y brunch',        'Opciones dulces y saladas servidas desde las 07:00.',          'sun', 2, 1),
  ('Repostería casera',         'Tortas, croissants y galletas horneados cada mañana.',         'cake', 3, 1),
  ('Eventos privados',          'Reuniones y celebraciones pequeñas con reserva previa.',       'users', 4, 1),
  ('Pedidos para llevar',       'Pide tu café o combo y recógelo en minutos.',                  'bag', 5, 1),
  ('Wi-Fi y espacio de trabajo','Mesas tranquilas y conexión estable para trabajar o estudiar.', 'laptop', 6, 1);

INSERT INTO especialidades (nombre, descripcion, imagen_url, orden, activo) VALUES
  ('Latte de vainilla',   'Espresso doble, leche texturizada y vainilla natural.',       NULL, 1, 1),
  ('Cold brew de la casa','Infusión en frío de 18 horas, servido con hielo y naranja.', NULL, 2, 1),
  ('Croissant de mantequilla','Laminado a mano, horneado en el momento.',               NULL, 3, 1),
  ('Chocolate abuela',    'Chocolate espeso con canela, a la antigua.',                  NULL, 4, 1);

INSERT INTO nosotros_secciones (titulo, contenido, orden) VALUES
  ('Nuestra historia', 'Café Aroma nació en 2015 como un pequeño puesto de café de origen. Hoy seguimos tostando en lotes pequeños y trabajando directamente con productores.', 1),
  ('Nuestra misión',   'Ofrecer un café honesto, bien preparado y un espacio cálido para compartir.', 2);

INSERT INTO fotos_tienda (imagen_url, descripcion, orden) VALUES
  ('/assets/placeholder.svg', 'Barra de café',       1),
  ('/assets/placeholder.svg', 'Salón principal',     2),
  ('/assets/placeholder.svg', 'Vitrina de repostería', 3);

INSERT INTO precios (categoria, nombre, descripcion, precio, moneda, orden, activo) VALUES
  ('Cafés calientes', 'Espresso',          'Shot simple',              10.00, 'Bs', 1, 1),
  ('Cafés calientes', 'Cappuccino',        'Espresso con espuma',      18.00, 'Bs', 2, 1),
  ('Cafés calientes', 'Latte',             'Espresso con leche',       20.00, 'Bs', 3, 1),
  ('Cafés fríos',     'Cold brew',         'Servido con hielo',        22.00, 'Bs', 1, 1),
  ('Cafés fríos',     'Frappé de moka',    'Batido con chocolate',     25.00, 'Bs', 2, 1),
  ('Repostería',      'Croissant',         'Mantequilla',              12.00, 'Bs', 1, 1),
  ('Repostería',      'Torta del día',     'Porción',                  15.00, 'Bs', 2, 1);
