const pool = require('../../config/pool_de_conexao');

exports.addComment = async (req, res) => {
  const { communityId, postId } = req.params;
  const { textoComentario } = req.body; // Certifique-se de que o nome corresponde ao campo no formulário
  const autorId = req.session?.autenticado?.usuarioId;

  console.log('req.body:', req.body); // Log para depuração

  if (!autorId) {
    return res.status(403).json({ error: 'Usuário não autenticado' });
  }

  if (!textoComentario) {
    return res.status(400).json({ error: 'Conteúdo do comentário é obrigatório' });
  }

  try {
    const curtidasPositivas = 0;
    const curtidasNegativas = 0;
    const status = 'normal';
    const resultadoEnquete = 0;

    await pool.query(
      `INSERT INTO COMENTARIO 
        (POSTAGEM_ID, AUTOR_ID, DATA_COMENTARIO, CURTIDAS_POSITIVAS_COMENTARIO, CURTIDAS_NEGATIVAS_COMENTARIO, TEXTO_COMENTARIO, STATUS_COMENTARIO, RESULTADO_ENQUETE)
       VALUES (?, ?, NOW(), ?, ?, ?, ?, ?)`,
      [postId, autorId, curtidasPositivas, curtidasNegativas, textoComentario, status, resultadoEnquete]
    );

    res.redirect(`/community/${communityId}/posts/${postId}`);
  } catch (error) {
    console.error('Erro ao adicionar comentário:', error);
    res.status(500).json({ error: 'Erro ao adicionar comentário' });
  }
};



exports.getComments = async (req, res) => {
  const { postId } = req.params;

  try {
    const [comments] = await pool.query(
      `SELECT c.ID_COMENTARIO, c.TEXTO_COMENTARIO, c.DATA_COMENTARIO, u.NOME_USUARIO AS AUTOR
       FROM COMENTARIO c
       JOIN USUARIO u ON c.AUTOR_ID = u.ID_USUARIO
       WHERE c.POSTAGEM_ID = ?
       ORDER BY c.DATA_COMENTARIO DESC`,
      [postId]
    );

    res.render('post-detail', { postId, comments }); // Ajuste conforme sua view
  } catch (error) {
    console.error('Erro ao buscar comentários:', error);
    res.status(500).json({ error: 'Erro ao buscar comentários' });
  }
};

exports.deleteComment = async (req, res) => {
  const commentId = req.params.id;

  try {
    await pool.query('DELETE FROM COMENTARIO WHERE ID_COMENTARIO = ?', [commentId]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir comentário' });
  }
};


// Incrementar curtidas positivas
exports.likeComment = async (req, res) => {
  const { commentId } = req.params;

  try {
    await pool.query(
      `UPDATE COMENTARIO SET CURTIDAS_POSITIVAS_COMENTARIO = CURTIDAS_POSITIVAS_COMENTARIO + 1 WHERE ID_COMENTARIO = ?`,
      [commentId]
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Erro ao adicionar curtida positiva:', error);
    res.status(500).json({ error: 'Erro ao adicionar curtida positiva' });
  }
};

// Incrementar curtidas negativas
exports.dislikeComment = async (req, res) => {
  const { commentId } = req.params;

  try {
    await pool.query(
      `UPDATE COMENTARIO SET CURTIDAS_NEGATIVAS_COMENTARIO = CURTIDAS_NEGATIVAS_COMENTARIO + 1 WHERE ID_COMENTARIO = ?`,
      [commentId]
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Erro ao adicionar curtida negativa:', error);
    res.status(500).json({ error: 'Erro ao adicionar curtida negativa' });
  }
};
