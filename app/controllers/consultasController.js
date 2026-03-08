const consultasModel = require('../models/consultas');
const { criarPagamentoConsulta } = require('../services/mercadoPagoConsultas');

const pagarConsulta = async (req, res) => {
    const { consultaId, email } = req.body;

    try {
        // Obtém os detalhes da consulta
        const consulta = await consultasModel.getConsultaById(consultaId);
        if (!consulta) {
            return res.status(404).json({ error: 'Consulta não encontrada' });
        }

        // Cria o pagamento via Mercado Pago
        const pagamento = await criarPagamentoConsulta(consulta, email);

        res.status(200).json({
            linkPagamento: pagamento.init_point,
            transacaoId: pagamento.id,
        });
    } catch (error) {
        console.error('Erro ao gerar pagamento da consulta:', error);
        res.status(500).json({ error: 'Erro ao gerar pagamento da consulta' });
    }
};

module.exports = { pagarConsulta };
