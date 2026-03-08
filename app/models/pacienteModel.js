var pool = require("../../config/pool_de_conexao");

const pacienteModel = {

    findAll: async () => {
        try {
            const [results] = await pool.query(
                `SELECT 
                    ID_USUARIO, NOME_USUARIO, EMAIL_USUARIO, 
                    SENHA_USUARIO, DT_NASC_USUARIO, 
                    DT_CRIACAO_CONTA_USUARIO, CPF_USUARIO, 
                    DIFERENCIACAO_USUARIO, PSICOLOGO_ID_PSICOLOGO, 
                    PUBLICACAO_COMUNIDADE_ID_PUBLICACOMU, 
                    CALENDARIO_ID_CALENDARIO
                 FROM USUARIO 
                 WHERE DIFERENCIACAO_USUARIO = 'Comum'`
            );
            return results;
        } catch (error) {
            console.error("Erro ao encontrar os usuários:", error);
            return [];
        }
    },

    findAllEmails: async () => {
        try {
            const [results] = await pool.query(
                "SELECT EMAIL_USUARIO FROM USUARIO WHERE DIFERENCIACAO_USUARIO = 'Comum'"
            );
            return results.map(user => user.EMAIL_USUARIO);
        } catch (error) {
            console.error("Erro ao encontrar os emails dos usuários:", error);
            return [];
        }
    },

    findUserCPF: async (camposForm) => {
        try {
            const [results] = await pool.query(
                "SELECT * FROM USUARIO WHERE CPF_USUARIO = ?", 
                [camposForm.CPF_USUARIO]
            );

            if (results.length > 0) {
                console.log("Usuário encontrado pelo CPF:", results[0]);
            } else {
                console.log("Nenhum usuário encontrado com o CPF fornecido.");
            }

            return results;
        } catch (error) {
            console.error("Erro ao buscar usuário pelo CPF:", error);
            return [];
        }
    },

    create: async (camposForm) => {
        try {
            const [results] = await pool.query(
                "INSERT INTO USUARIO SET ?", 
                [camposForm]
            );
            console.log("Novo usuário criado com ID:", results.insertId);
            return results;
        } catch (error) {
            console.error("Erro ao criar a conta:", error);
            return null;
        }
    },
};

module.exports = pacienteModel;
