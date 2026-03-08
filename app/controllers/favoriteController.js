const Favorite = require('../models/Favorite');

exports.toggleFavorite = async (req, res) => {
  const { postagemId } = req.body;
  const usuarioId = req.session?.userId;

  if (!usuarioId) return res.status(403).json({ error: 'Usuário não autenticado' });

  try {
    const result = await Favorite.toggleFavorite(postagemId, usuarioId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao processar favorito' });
  }
};

exports.listFavorites = async (req, res) => {
  const usuarioId = req.session?.userId;

  if (!usuarioId) return res.status(403).json({ error: 'Usuário não autenticado' });

  try {
    const favorites = await Favorite.listFavorites(usuarioId);
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar favoritos' });
  }
};
