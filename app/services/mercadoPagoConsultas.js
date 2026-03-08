const { Payment } = require('mercadopago');
const mercadoPagoClient = require('./mercadoPagoConfig');

const payment = new Payment(mercadoPagoClient);

const criarPagamentoConsulta = async (consulta, emailUsuario) => {
    const body = {
        transaction_amount: consulta.VALOR_CONSULTA,
        description: `Consulta com psicólogo ID ${consulta.PSICOLOGO_ID_PSICOLOGO}`,
        payment_method_id: 'pix',
        payer: { email: emailUsuario },
    };

    try {
        const response = await payment.create({ body });
        return response;
    } catch (error) {
        console.error('Erro ao criar pagamento da consulta:', error);
        throw error;
    }
};

module.exports = { criarPagamentoConsulta };
