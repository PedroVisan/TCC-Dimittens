const { MercadoPagoConfig, Payment } = require('mercadopago');

const client = new MercadoPagoConfig({
  accessToken: 'YOUR_ACCESS_TOKEN',
});

const payment = new Payment(client);

async function criarPagamentoPlano(usuarioId, plano) {
  const { VALOR_PLANOS, PERIODOS_PLANOS } = plano;

  const body = {
    transaction_amount: VALOR_PLANOS,
    description: `Plano de assinatura ${PERIODOS_PLANOS}`,
    payment_method_id: 'pix', // Método de pagamento
    payer: {
      email: 'usuario@exemplo.com', // Substituir pelo e-mail real do usuário
    },
  };

  try {
    const response = await payment.create({ body });
    return response;
  } catch (error) {
    console.error("Erro ao criar pagamento:", error);
    throw error;
  }
}

module.exports = { criarPagamentoPlano };
