require('dotenv').config();
const app = require('./src/app');
const { precalentarModelo } = require('./src/chatbot/ollamaClient');

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`API de la cafetería escuchando en http://localhost:${PORT}/api`);
  // En segundo plano: no bloquea el arranque de la API
  precalentarModelo();
});
