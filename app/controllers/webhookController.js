const planosModel = require('../models/planos');

// Webhook para lidar com notificações do Mercado Pago
const handleWebhook = async (req, res) => {
    try {
        const { id, type } = req.body; // Captura o ID da transação e o tipo da notificação

        // Verifica se é uma notificação de pagamento
        if (type === 'payment') {
            // Busca os detalhes do pagamento na API do Mercado Pago
            const payment = await paymentService.getPaymentDetails(id);

            if (payment.status === 'approved') {
                const email = payment.payer.email; // Email do pagador
                const plano = payment.metadata.plano; // Informações do plano

                // Atualiza o banco de dados para ativar o plano do usuário
                const usuario = await planosModel.ativarPlano(email, plano, payment.id);

                console.log(`Pagamento aprovado. Plano ativado para o usuário: ${email}`);
            } else {
                console.log(`Pagamento com status ${payment.status} para o ID: ${id}`);
            }
        }

        res.status(200).send('Webhook recebido e processado');
    } catch (error) {
        console.error('Erro ao processar webhook:', error);
        res.status(500).send('Erro ao processar webhook');
    }
};

module.exports = { handleWebhook };
