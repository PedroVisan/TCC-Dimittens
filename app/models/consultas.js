// models/consultas.js
const pool = require('../../config/pool_de_conexao');

module.exports = {
    getConsultaById: async (id) => {
        const [consulta] = await pool.query(
            'SELECT * FROM CONSULTAS WHERE ID_CONSULTAS = ?',
            [id]
        );
        return consulta;
    },

    criarConsulta: async (dados) => {
        const {
            usuarioId,
            psicologoId,
            dataHora,
            status = 'Pendente',
            valorConsulta
        } = dados;

        return await pool.query(
            `INSERT INTO CONSULTAS 
            (USUARIO_ID_USUARIO, PSICOLOGO_ID_PSICOLOGO, DATAHORA_CONSULTAS, STATUS_CONSULTAS, VALOR_CONSULTAS) 
            VALUES (?, ?, ?, ?, ?)`,
            [usuarioId, psicologoId, dataHora, status, valorConsulta]
        );
    },

    atualizarStatusConsulta: async (consultaId, novoStatus) => {
        return await pool.query(
            'UPDATE CONSULTAS SET STATUS_CONSULTAS = ? WHERE ID_CONSULTAS = ?',
            [novoStatus, consultaId]
        );
    },

    getConsultasUsuario: async (usuarioId) => {
        return await pool.query(
            'SELECT * FROM CONSULTAS WHERE USUARIO_ID_USUARIO = ? ORDER BY DATAHORA_CONSULTAS DESC',
            [usuarioId]
        );
    },

    getConsultasPsicologo: async (psicologoId) => {
        return await pool.query(
            'SELECT * FROM CONSULTAS WHERE PSICOLOGO_ID_PSICOLOGO = ? ORDER BY DATAHORA_CONSULTAS DESC',
            [psicologoId]
        );
    }
    
};