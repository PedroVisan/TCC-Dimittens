const pool = require('../../config/pool_de_conexao');

class Like {
  static async toggleLike(tipo, conteudoId, usuarioId) {
    // Verifica se já existe uma curtida
    const [rows] = await pool.query(
      'SELECT * FROM CURTIDA WHERE TIPO = ? AND CONTEUDO_ID = ? AND USUARIO_ID = ?',
      [tipo, conteudoId, usuarioId]
    );

    if (rows.length > 0) {
      // Remove a curtida se já existir
      await pool.query(
        'DELETE FROM CURTIDA WHERE TIPO = ? AND CONTEUDO_ID = ? AND USUARIO_ID = ?',
        [tipo, conteudoId, usuarioId]
      );
      return { status: 'removed' };
    } else {
      // Adiciona a curtida se não existir
      await pool.query(
        'INSERT INTO CURTIDA (TIPO, CONTEUDO_ID, USUARIO_ID) VALUES (?, ?, ?)',
        [tipo, conteudoId, usuarioId]
      );
      return { status: 'added' };
    }
  }

  static async countLikes(tipo, conteudoId) {
    const [rows] = await pool.query(
      'SELECT COUNT(*) AS total FROM CURTIDA WHERE TIPO = ? AND CONTEUDO_ID = ?',
      [tipo, conteudoId]
    );
    return rows[0].total;
  }
}

module.exports = Like;
