const { Payment } = require('mercadopago');
const mercadoPagoClient = require('./mercadoPagoConfig');

const payment = new Payment(mercadoPagoClient);

// Criar pagamento do plano
const criarPagamentoPlano = async (plano, emailUsuario) => {
    const body = {
        transaction_amount: plano.PRECO,
        description: `Plano ${plano.PERIODOS_PLANOS}`,
        payment_method_id: 'pix', // Certifique-se de que 'pix' é o método suportado
        payer: { email: emailUsuario },
        metadata: { plano: plano.PERIODOS_PLANOS, email: emailUsuario },
    };

    console.log('Dados enviados para o Mercado Pago:', body);

    try {
        const response = await payment.create({ body });
        console.log('Resposta do Mercado Pago:', response.body);
        return response;
    } catch (error) {
        console.error('Erro ao criar pagamento do plano:', error.response);
        throw error;
    }
};

// Buscar detalhes do pagamento pelo ID
const getPaymentDetails = async (paymentId) => {
    try {
        const response = await payment.get({ id: paymentId });
        return response.body;
    } catch (error) {
        console.error('Erro ao buscar detalhes do pagamento:', error);
        throw error;
    }
};

module.exports = { criarPagamentoPlano, getPaymentDetails };
