const pool = require('../../config/pool_de_conexao');

const editarPerfilModel = {
    getProfileData: async (idUsuario, tipoUsuario) => {
        try {
            console.log("Consultando dados do perfil:", { idUsuario, tipoUsuario });

            if (tipoUsuario === 'Psicologo') {
                const [rows] = await pool.query(`
                    SELECT 
                        u.NOME_USUARIO, u.EMAIL_USUARIO, u.TEL_USUARIO, u.IMAGEM_PERFIL, u.CRP_USUARIO,
                        p.ABORDAGEM_ABRANGENTE_PSICOLOGO AS ABORDAGEM, p.ESPECIALIDADE_PSICOLOGO AS ESPECIALIDADE,
                        p.BIOGRAFIA_PSICOLOGO AS BIOGRAFIA, p.VALOR_CONSULTA_PSICOLOGO AS VALOR_CONSULTA,
                        p.PUBLICO_ALVO_PSICOLOGO AS PUBLICO_ALVO
                    FROM USUARIO u
                    JOIN PSICOLOGO p ON u.ID_USUARIO = p.ID_USUARIO
                    WHERE u.ID_USUARIO = ?
                `, [idUsuario]);

                console.log("Dados encontrados para psicólogo:", rows);
                return rows[0];
            } else {
                const [rows] = await pool.query(`
                    SELECT 
                        NOME_USUARIO, EMAIL_USUARIO, TEL_USUARIO, IMAGEM_PERFIL, CRP_USUARIO
                    FROM USUARIO
                    WHERE ID_USUARIO = ?
                `, [idUsuario]);

                console.log("Dados encontrados para usuário comum:", rows);
                return rows[0];
            }
        } catch (error) {
            console.error("Erro ao buscar dados do perfil:", error);
            throw error;
        }
    }
};

module.exports = editarPerfilModel;
