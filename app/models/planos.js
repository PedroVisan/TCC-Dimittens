const pool = require('../../config/pool_de_conexao');

module.exports = {
  // Listar Planos Ativos
  getPlanos: async () => {
    return await pool.query('SELECT * FROM PLANOS WHERE STATUS_PLANOS = "Ativa"');
  },

  // Verificar Assinatura Ativa do Usuário
  verificarAssinaturaAtiva: async (usuarioId) => {
    const [assinatura] = await pool.query(
      `SELECT * FROM ASSINATURA 
       WHERE USUARIO_ID_USUARIO = ? AND DATA_FIM > NOW()`,
      [usuarioId]
    );
    return assinatura || null;
  },

  // Criar Nova Assinatura no Banco
  criarAssinatura: async (usuarioId, planoId, dataInicio, dataFim) => {
    return await pool.query(
      `INSERT INTO ASSINATURA (USUARIO_ID_USUARIO, PLANOS_ID_PLANOS, DATA_INICIO, DATA_FIM) 
       VALUES (?, ?, ?, ?)`,
      [usuarioId, planoId, dataInicio, dataFim]
    );
  },

  // Ativar ou Renovar Plano com Base no Pagamento
  ativarPlano: async (usuarioId, planoId, duracaoDias, transactionId) => {
    try {
      const dataInicio = new Date(); // Data atual como início
      const dataFim = new Date();
      dataFim.setDate(dataFim.getDate() + duracaoDias); // Calcula a data final com base na duração

      // Atualiza ou insere nova assinatura
      const [assinaturaAtiva] = await pool.query(
        `SELECT * FROM ASSINATURA 
         WHERE USUARIO_ID_USUARIO = ? AND PLANOS_ID_PLANOS = ? AND DATA_FIM > NOW()`,
        [usuarioId, planoId]
      );

      if (assinaturaAtiva) {
        // Atualiza a data de fim da assinatura existente
        await pool.query(
          `UPDATE ASSINATURA SET DATA_FIM = ?
           WHERE USUARIO_ID_USUARIO = ? AND PLANOS_ID_PLANOS = ?`,
          [dataFim, usuarioId, planoId]
        );
      } else {
        // Cria uma nova assinatura
        await pool.query(
          `INSERT INTO ASSINATURA (USUARIO_ID_USUARIO, PLANOS_ID_PLANOS, DATA_INICIO, DATA_FIM, TRANSACTION_ID) 
           VALUES (?, ?, ?, ?, ?)`,
          [usuarioId, planoId, dataInicio, dataFim, transactionId]
        );
      }
    } catch (error) {
      console.error('Erro ao ativar plano:', error);
      throw error;
    }
  },
};
