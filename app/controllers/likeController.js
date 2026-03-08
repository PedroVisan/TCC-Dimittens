const Like = require('../models/Like');

exports.toggleLike = async (req, res) => {
  const { tipo, conteudoId } = req.body;
  const usuarioId = req.session?.userId;

  if (!usuarioId) return res.status(403).json({ error: 'Usuário não autenticado' });

  try {
    const result = await Like.toggleLike(tipo, conteudoId, usuarioId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao processar curtida' });
  }
};

exports.getLikesCount = async (req, res) => {
  const { tipo, conteudoId } = req.params;

  try {
    const total = await Like.countLikes(tipo, conteudoId);
    res.json({ total });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter contagem de curtidas' });
  }
};
