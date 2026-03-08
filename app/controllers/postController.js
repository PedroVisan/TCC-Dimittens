const Post = require('../models/Post');
const pool = require('../../config/pool_de_conexao');

exports.getPostDetails = async (req, res) => {
  const { communityId, postId } = req.params;

  try {
    // Buscar detalhes da postagem junto com o nome do autor
    const [postResults] = await pool.query(
      `SELECT p.*, u.NOME_USUARIO AS AUTOR_NOME
       FROM POSTAGEM p
       JOIN USUARIO u ON p.AUTOR_ID = u.ID_USUARIO
       WHERE p.COMUNIDADE_ID = ? AND p.ID_POSTAGEM = ?`,
      [communityId, postId]
    );

    if (postResults.length === 0) {
      return res.status(404).json({ error: 'Postagem não encontrada' });
    }

    const post = postResults[0];

    // Buscar comentários da postagem junto com os nomes dos autores
    const [comments] = await pool.query(
      `SELECT c.*, u.NOME_USUARIO AS AUTOR_NOME
       FROM COMENTARIO c
       JOIN USUARIO u ON c.AUTOR_ID = u.ID_USUARIO
       WHERE c.POSTAGEM_ID = ?
       ORDER BY c.DATA_COMENTARIO ASC`,
      [postId]
    );

    res.render('pages/post-detail', { post, comments, communityId });
  } catch (error) {
    console.error('Erro ao buscar detalhes da postagem:', error);
    res.status(500).json({ error: 'Erro ao buscar detalhes da postagem' });
  }
};

exports.newPostForm = (req, res) => {
  const { communityId } = req.params;
  res.render('partial/new-post', { communityId });
};

exports.listPosts = async (req, res) => {
  const { communityId } = req.params;

  if (!communityId) {
      return res.redirect('/community');
  }

  try {
      const [posts] = await pool.query('SELECT * FROM POSTAGEM WHERE COMUNIDADE_ID = ?', [communityId]);
      res.render('partial/posts', { posts });
  } catch (error) {
      console.error('Erro ao listar postagens:', error);
      res.status(500).send('Erro ao listar postagens.');
  }
};


exports.createPost = async (req, res) => {
  const { communityId } = req.params;
  const { title, content, type } = req.body;
  const image = req.file ? req.file.filename : null; // Nome do arquivo de imagem
  const authorId = req.session.autenticado?.usuarioId;

  if (!authorId) {
    return res.status(403).json({ error: 'Usuário não autenticado' });
  }

  if (!title || !content || !type) {
    return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO POSTAGEM (TITULO_POSTAGEM, CONTEUDO_POSTAGEM, IMAGEM_POSTAGEM, DATA_POSTAGEM, TIPO_POSTAGEM, COMUNIDADE_ID, AUTOR_ID)
       VALUES (?, ?, ?, NOW(), ?, ?, ?)`,
      [title, content, image, type, communityId, authorId]
    );

    // Redireciona para a lista de postagens
    req.session.message = 'Postagem criada com sucesso!';
    res.redirect(`/community/${communityId}/posts`);
  } catch (error) {
    console.error('Erro ao criar postagem:', error);
    res.status(500).json({ error: 'Erro ao criar postagem' });
  }
};



