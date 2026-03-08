const pool = require('../../config/pool_de_conexao');

// Criação de uma nova comunidade
exports.createCommunity = async (req, res) => {
  const { name, biography, approach } = req.body;
  const userId = req.session?.autenticado?.usuarioId;

  if (!userId) {
      return res.status(403).json({ error: 'Usuário não autenticado' });
  }

  try {
      // Insere a comunidade no banco
      const query = `
          INSERT INTO COMUNIDADE (NOME_COMUNIDADE, BIOGRAFIA_COMUNIDADE, ABORDAGEM_COMUNIDADE, CRIADO_POR)
          VALUES (?, ?, ?, ?)
      `;
      const values = [name, biography, approach, userId];
      await pool.query(query, values);

      // Adiciona um flash message (aviso temporário) e redireciona
      req.session.message = 'Comunidade criada com sucesso!';
      res.redirect('/community');
  } catch (error) {
      console.error('Erro ao criar comunidade:', error);
      res.status(500).send('Erro ao criar comunidade');
  }
};


// Obter detalhes de uma comunidade
exports.getCommunityDetails = async (req, res) => {
  const { id } = req.params;
  try {
      const [community] = await pool.query('SELECT * FROM COMUNIDADE WHERE ID_COMUNIDADE = ?', [id]);
      const [posts] = await pool.query('SELECT * FROM POSTAGEM WHERE COMUNIDADE_ID = ?', [id]);

      if (community.length === 0) {
          return res.status(404).send('Comunidade não encontrada');
      }

      res.render('pages/community-details', { 
          community: community[0], 
          posts 
      });
  } catch (error) {
      console.error('Erro ao buscar detalhes da comunidade:', error);
      res.status(500).send('Erro ao buscar detalhes da comunidade');
  }
};

// Listar todas as comunidades
exports.listCommunities = async (req, res) => {
  try {
      const [rows] = await pool.query('SELECT * FROM COMUNIDADE');
      console.log('Comunidades obtidas:', rows); // Log de depuração
      res.render('partial/community', { 
          communities: rows, 
          autenticado: req.session.autenticado || null 
      });
  } catch (error) {
      console.error('Erro ao listar comunidades:', error);
      res.status(500).json({ error: 'Erro ao listar comunidades.' });
  }
};
