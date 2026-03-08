const pool = require('../../config/pool_de_conexao');

class Favorite {
  static async toggleFavorite(postagemId, usuarioId) {
    const [rows] = await pool.query(
      'SELECT * FROM FAVORITO WHERE POSTAGEM_ID = ? AND USUARIO_ID = ?',
      [postagemId, usuarioId]
    );

    if (rows.length > 0) {
      await pool.query('DELETE FROM FAVORITO WHERE POSTAGEM_ID = ? AND USUARIO_ID = ?', [postagemId, usuarioId]);
      return { status: 'removed' };
    } else {
      await pool.query('INSERT INTO FAVORITO (POSTAGEM_ID, USUARIO_ID) VALUES (?, ?)', [postagemId, usuarioId]);
      return { status: 'added' };
    }
  }

  static async listFavorites(usuarioId) {
    const [rows] = await pool.query(
      'SELECT POSTAGEM.* FROM FAVORITO JOIN POSTAGEM ON FAVORITO.POSTAGEM_ID = POSTAGEM.ID_POSTAGEM WHERE FAVORITO.USUARIO_ID = ?',
      [usuarioId]
    );
    return rows;
  }
}

module.exports = Favorite;
