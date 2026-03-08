const { PaymentAPI } = require('./mercadoPagoConfig');

const criarPagamentoPlano = async (plano, emailUsuario) => {
  const body = {
    transaction_amount: plano.PRECO,
    description: `Plano ${plano.PERIODOS_PLANOS}`,
    payment_method_id: 'pix', // Or any other valid payment method
    payer: {
      email: emailUsuario,
    },
    metadata: {
      plano: plano.PERIODOS_PLANOS,
      email: emailUsuario,
    },
  };

  try {
    // Create payment using the PaymentAPI
    const response = await PaymentAPI.create({ body });
    return response;
  } catch (error) {
    console.error('Erro ao criar pagamento:', error);
    throw error;
  }
};

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
const getPaymentDetails = async (paymentId) => {
    try {
        const response = await payment.get({ id: paymentId });
        return response.body;
    } catch (error) {
        console.error('Erro ao buscar detalhes do pagamento:', error);
        throw error;
    }
};

module.exports = { criarPagamentoPlano, criarPagamentoConsulta, getPaymentDetails };
