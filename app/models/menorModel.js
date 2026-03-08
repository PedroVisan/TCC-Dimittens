var pool = require("../../config/pool_de_conexao");

const menorModel = {
  
    // Busca todos os usuários do tipo 'Menor de Idade'
    findAll: async () => {
        try {
            const [results] = await pool.query(
                "SELECT " +
                "ID_USUARIO, NOME_USUARIO, " +
                "EMAIL_USUARIO, SENHA_USUARIO, " +
                "DT_NASC_USUARIO, " +
                "DT_CRIACAO_CONTA_USUARIO, " +
                "CPF_USUARIO, " +
                "DIFERENCIACAO_USUARIO, " +
                "CPF_RESPONSAVEL, " +
                "NOME_RESPONSAVEL " +
                "FROM USUARIO WHERE DIFERENCIACAO_USUARIO = 'Menor de Idade'"
            );
            return results || []; // Retorna um array vazio se não houver resultados
        } catch (error) {
            console.log("Erro ao encontrar os menores", error);
            return error; // Retorna um array vazio em caso de erro
        }
    },

    // Busca todos os emails de usuários do tipo 'Menor de Idade'
    findAllEmails: async () => {
        try {
            const [results] = await pool.query(
                "SELECT EMAIL_USUARIO FROM USUARIO WHERE DIFERENCIACAO_USUARIO = 'Menor de Idade'"
            );
            return results.map(user => user.EMAIL_USUARIO) || []; // Retorna um array vazio se não houver resultados
        } catch (error) {
            console.log("Erro ao encontrar os emails dos menores", error);
            return []; // Retorna um array vazio em caso de erro
        }
    },

    // Busca um usuário pelo CPF
    findUserCPF: async (camposForm) => {
        try {
            const [results] = await pool.query(
                "SELECT * FROM USUARIO WHERE CPF_USUARIO = ?",  
                [camposForm.CPF_USUARIO] 
            );
            return results;
        } catch (error) {
            console.log("Erro ao comparar o CPF do menor", error);
            return error; // Retorna um array vazio em caso de erro
        }
    },

    // Busca um usuário pelo CPF e data de nascimento
    findUser: async (camposForm) => {
        try {
            const [results] = await pool.query(
                "SELECT * FROM USUARIO WHERE CPF_USUARIO = ? AND DT_NASC_USUARIO = ?",  
                [camposForm.CPF_USUARIO, camposForm.DT_NASC_USUARIO] 
            );
            return results; // Retorna um array vazio se não houver resultados
        } catch (error) {
            console.log("Erro ao buscar usuário:", error);
            return error; // Retorna um array vazio em caso de erro
        }
    },

    // Cria um novo usuário
    create: async (camposForm) => {
        try {
            const [results] = await pool.query(
                "INSERT INTO USUARIO SET ?", [camposForm] 
            );
            return results; // Retorna o resultado da inserção
        } catch (error) {
            console.log("Erro ao criar a conta do menor", error);
            return null; // Retorna null em caso de erro
        }
    },
};

module.exports = menorModel;
