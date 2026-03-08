const Report = require('../models/Report');

exports.createReport = async (req, res) => {
  const { tipo, conteudoId, motivo } = req.body;
  const usuarioId = req.session?.userId;

  if (!usuarioId) return res.status(403).json({ error: 'Usuário não autenticado' });

  try {
    const result = await Report.create(tipo, conteudoId, motivo, usuarioId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar denúncia' });
  }
};

exports.listReports = async (req, res) => {
  try {
    const reports = await Report.listReports();
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar denúncias' });
  }
};
