# ☕ Café Don Richard — Web de cafetería

Aplicación web de una cafetería con:

- **Frontend**: Angular (standalone, sin NgModules) en `frontend/`
- **Backend**: Node.js + Express en `backend/`
- **Base de datos**: MySQL (`backend/database/schema.sql` + `seed.sql`)
- **Chatbot**: Ollama con el modelo `gemma3`, integrado en la API
- **Videos**: Pexels (video en bucle en Inicio)

Todas las páginas del frontend obtienen sus datos desde la API Node.js: nada de contenido fijo en el código.

| Tabla                | Qué controla                                                             |
| -------------------- | ------------------------------------------------------------------------ |
| `configuracion`      | Nombre, ícono, slogan, textos de portada, dirección, teléfono, correo, horario |
| `paginas`            | Menú: etiqueta, título, descripción, tarjeta en Inicio, orden y visibilidad |
| `textos`             | Botones, etiquetas del formulario, mensajes, pie, chatbot (saludo e instrucciones) |
| `videos_inicio`      | Video en bucle de Pexels                                                 |
| `servicios`          | Servicios (con ícono emoji)                                              |
| `especialidades`     | Especialidades con imagen                                                |
| `nosotros_secciones` | Historia / misión                                                        |
| `fotos_tienda`       | Galería de la tienda                                                     |
| `precios`            | Carta de precios por categoría                                           |
| `contactos`          | Mensajes recibidos del formulario                                        |
| `chat_mensajes`      | Historial del chatbot                                                    |

El único texto fijo es el aviso "No se pudo conectar con el servidor", que se muestra justamente cuando la base de datos no está disponible.

## Páginas

| Ruta             | Contenido                                                        |
| ---------------- | ---------------------------------------------------------------- |
| `/`              | Inicio con video en bucle de la cafetería                        |
| `/servicios`     | Servicios que ofrece la cafetería                                 |
| `/especialidades`| Especialidades de la casa                                         |
| `/nosotros`      | Historia, dirección, teléfono, horario y fotos de la tienda       |
| `/precios`       | Lista de precios agrupada por categoría                           |
| `/contactos`     | Formulario de contacto (guardado en MySQL)                        |

Además hay un chatbot flotante (💬) que responde con la información del local.

## Endpoints de la API (`/api`)

| Método | Ruta                  | Descripción                                   |
| ------ | --------------------- | --------------------------------------------- |
| GET    | `/health`             | Estado del servidor                           |
| GET    | `/inicio`             | Textos de portada y video                     |
| GET    | `/sitio`              | Tablas `configuracion`, `textos` y `paginas` (menú, títulos, etiquetas) |
| GET    | `/servicios`          | Lista de servicios                            |
| GET    | `/especialidades`     | Lista de especialidades                       |
| GET    | `/nosotros`           | Secciones de historia, fotos y contacto       |
| GET    | `/precios`            | Precios agrupados por categoría               |
| POST   | `/contactos`          | Guarda un mensaje del formulario              |
| POST   | `/chatbot`            | Envía un mensaje al chatbot (`sesionId`, `mensaje`) |
| GET    | `/chatbot/estado`     | Indica si Ollama y gemma3 están disponibles   |

## Estructura

```
backend/
  database/        schema.sql (tablas) y seed.sql (datos de ejemplo)
  server.js        arranque del servidor
  src/
    app.js         configuración de Express
    config/        conexión MySQL (pool)
    models/        consultas SQL por entidad
    controllers/   lógica de cada endpoint
    middleware/    validación, 404 y manejo de errores
    routes/        definición de rutas /api
    chatbot/       cliente de Ollama y servicio del chatbot
frontend/
  proxy.conf.json  redirige /api al backend en desarrollo
  src/app/
    core/          ApiService y modelos de datos
    pages/         una página por sección del menú
    components/    chatbot flotante
```

## Puesta en marcha

### 1. Base de datos MySQL

```bash
mysql -u root -p < backend/database/schema.sql
mysql -u root -p < backend/database/seed.sql
```

### 2. Chatbot (Ollama + gemma3)

Instala [Ollama](https://ollama.com) y descarga el modelo:

```bash
ollama pull gemma3
```

### 3. Backend

```bash
cd backend
cp .env.example .env     # en Windows: copy .env.example .env
npm install
npm run dev              # o: npm start
```

La API queda en `http://localhost:3000/api`.

### 4. Frontend

```bash
cd frontend
npm install
npm start
```

Abre `http://localhost:4200`. Las llamadas a `/api` se redirigen al backend mediante `proxy.conf.json`.

### Video de Pexels

1. Busca un video de cafetería en <https://www.pexels.com/> y descarga la versión MP4.
2. Actualiza la fila en la tabla `videos_inicio`:

```sql
UPDATE videos_inicio SET url_video = 'https://.../tu-video.mp4', fuente = 'https://www.pexels.com/video/...' WHERE id = 1;
```

Respeta la licencia de Pexels al usar los videos (atribución opcional, uso libre).

## Datos de ejemplo

Los textos, precios y teléfonos de `seed.sql` son ficticios. Edítalos desde la base de datos; el frontend no necesita cambios.

## Pendiente / a revisar

- Las fotos de la tienda y de las especialidades usan `assets/placeholder.svg` hasta que se carguen imágenes reales.
- El endpoint de chatbot guarda el historial en `chat_mensajes`.
- No hay panel de administración: el contenido se actualiza en MySQL.
