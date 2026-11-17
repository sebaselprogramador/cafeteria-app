const mysql = require('mysql2/promise');

// Pool de conexiones MySQL. Los valores llegan del archivo .env
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'cafeteria_db',
  waitForConnections: true,
  connectionLimit: 10,
  namedPlaceholders: false,
  charset: 'utf8mb4',
});

async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

module.exports = { pool, query };
