const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 3,  // Reduzido para 3
    queueLimit: 0,  // Limita a fila para evitar sobrecarga
    multipleStatements: true,
    connectTimeout: 30000,
});

// Teste de Conexão
pool.getConnection()
    .then(conn => {
        console.log('Conectado ao Banco de Dados');
        conn.release();  // Libera a conexão imediatamente
    })
    .catch(err => {
        console.error('Erro ao conectar ao Banco de Dados:', err.message);
    });

    

module.exports = pool;
