const pool = require('../../config/pool_de_conexao');

class Report {
  static async create(tipo, conteudoId, motivo, usuarioId) {
    await pool.query(
      'INSERT INTO DENUNCIA (TIPO, CONTEUDO_ID, MOTIVO, USUARIO_ID) VALUES (?, ?, ?, ?)',
      [tipo, conteudoId, motivo, usuarioId]
    );
    return { success: true };
  }

  static async listReports() {
    const [rows] = await pool.query('SELECT * FROM DENUNCIA');
    return rows;
  }
}

module.exports = Report;
