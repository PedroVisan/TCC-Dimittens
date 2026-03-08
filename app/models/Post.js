const pool = require('../../config/pool_de_conexao');

class Post {
  static async list() {
    const [rows] = await pool.query('SELECT * FROM POSTAGEM');
    return rows;
  }

  static async create(title, content, image, type, communityId, authorId) {
    const [result] = await pool.query(
      'INSERT INTO POSTAGEM (TITULO_POSTAGEM, CONTEUDO_POSTAGEM, IMAGEM_POSTAGEM, TIPO_POSTAGEM, COMUNIDADE_ID, AUTOR_ID) VALUES (?, ?, ?, ?, ?, ?)',
      [title, content, image, type, communityId, authorId]
    );
    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM POSTAGEM WHERE ID_POSTAGEM = ?', [id]);
    return rows[0];
  }
}

module.exports = Post;
