const pool = require('../../config/pool_de_conexao');

class Community {
  static async list() {
    const [rows] = await pool.query('SELECT * FROM COMUNIDADE');
    return rows;
  }

  static async create(name, biography, approach, createdBy) {
    const [result] = await pool.query(
      'INSERT INTO COMUNIDADE (NOME_COMUNIDADE, BIOGRAFIA_COMUNIDADE, ABORDAGEM_COMUNIDADE, CRIADO_POR) VALUES (?, ?, ?, ?)',
      [name, biography, approach, createdBy]
    );
    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM COMUNIDADE WHERE ID_COMUNIDADE = ?', [id]);
    return rows[0];
  }
}

module.exports = Community;
