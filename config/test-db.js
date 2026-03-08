const mysql = require('mysql2/promise');
require('dotenv').config();  // Carrega as variáveis de ambiente

(async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306,
      connectTimeout: 10000,  // Timeout de conexão
    });

    console.log('Conectado ao banco de dados com sucesso!');
    connection.end();
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error.message);
  }
})();
