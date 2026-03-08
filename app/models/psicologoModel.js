var pool = require("../../config/pool_de_conexao");

const psicologoModel = {
  
    findAll: async () => {
        try {
            const [results] = await pool.query(
                "SELECT " +
                "ID_USUARIO, NOME_USUARIO, " +
                "EMAIL_USUARIO, SENHA_USUARIO, " +
                "DT_CRIACAO_CONTA_USUARIO, " +
                "DT_NASC_USUARIO, " +
                "CPF_USUARIO, "  +
                "CRP_USUARIO, "  +
                "DIFERENCIACAO_USUARIO " +
                "FROM USUARIO WHERE DIFERENCIACAO_USUARIO = 'Psicologo'"
            );
            return results;
        } catch (error) {
            console.log("Erro ao encontrar os psicólogos", error);
            return error;
        }
    },
    
    findAllEmails: async () => {
        try {
            const [results] = await pool.query(
                "SELECT EMAIL_USUARIO FROM USUARIO WHERE DIFERENCIACAO_USUARIO = 'Psicologo'"
            );
            return results.map(user => user.EMAIL_USUARIO);
        } catch (error) {
            console.log("Erro ao encontrar os emails dos psicólogos", error);
            return [];
        }
    },

    // Nova função para buscar todos os CRPs
    findAllCRPs: async () => {
        try {
            const [results] = await pool.query(
                "SELECT CRP_USUARIO FROM USUARIO WHERE DIFERENCIACAO_USUARIO = 'Psicologo'"
            );
            return results.map(user => user.CRP_USUARIO);
        } catch (error) {
            console.log("Erro ao encontrar os CRPs dos psicólogos", error);
            return [];
        }
    },

    // Manter a função para buscar CRP de um usuário específico
    findUserCRP: async (camposForm) => {
        try {
            const [results] = await pool.query(
                "SELECT CRP_USUARIO FROM USUARIO WHERE CPF_USUARIO = ?",  
                [camposForm.CPF_USUARIO] // Aqui você pode passar o CPF do formulário
            );
            return results;
        } catch (error) {
            console.log("Erro ao encontrar o CRP do psicólogo", error);
            return error;
        }
    },

    findUserCPF: async (camposForm) => {
        try {
            const [results] = await pool.query(
                "SELECT * FROM USUARIO WHERE CPF_USUARIO = ?",  
                [camposForm.CPF_USUARIO] 
            );
            return results;
        } catch (error) {
            console.log("Erro ao comparar o CPF do psicólogo", error);
            return error;
        }
    },

    create: async (camposForm) => {
        try {
            const [results] = await pool.query(
                "INSERT INTO USUARIO SET ?", [camposForm] 
            );
            return results;
        } catch (error) {
            console.log("Erro ao criar a conta do psicólogo", error);
            return null;
        }
    },
};

module.exports = psicologoModel;
