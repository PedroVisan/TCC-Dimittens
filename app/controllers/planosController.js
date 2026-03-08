const planosModel = require('../models/planos');
const mercadoPagoService = require('../services/mercadoPagoPlanos');

// Listar Planos Disponíveis
const comprarPlano = async (req, res) => {
    const { plano, valor, email } = req.body;

    // Obtém o tipo de usuário da sessão
    const usuario = req.session.autenticado;

    if (!usuario) {
        return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    // Verifica se o tipo de usuário é Psicólogo
    if (usuario.tipo === 'Psicologo') {
        return res.status(403).json({
            error: 'Psicólogos já possuem os benefícios dos planos e não podem adquiri-los.'
        });
    }

    try {
        // Aqui você integra a lógica de pagamento do Mercado Pago
        const pagamento = await criarPagamentoPlano(plano, valor, email); // Método de integração com Mercado Pago

        return res.status(200).json({
            linkPagamento: pagamento.init_point, // URL para o pagamento
        });
    } catch (error) {
        console.error('Erro ao processar pagamento do plano:', error);
        return res.status(500).json({ error: 'Erro ao processar pagamento. Tente novamente mais tarde.' });
    }
};

// Verificar Assinatura do Usuário
async function verificarAssinatura(req, res) {
  try {
    const userId = req.session.autenticado.usuarioId; // Captura o ID do usuário logado
    const assinatura = await planosModel.verificarAssinaturaAtiva(userId);

    if (assinatura) {
      res.status(200).json({ success: true, assinatura });
    } else {
      res.status(404).json({ success: false, message: "Sem assinatura ativa." });
    }
  } catch (error) {
    console.error("Erro ao verificar assinatura:", error);
    res.status(500).json({ success: false, message: "Erro ao verificar assinatura." });
  }
}

module.exports = { comprarPlano, verificarAssinatura };
