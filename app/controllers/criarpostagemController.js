const Postagem = require("../models/criarpostagemModel");


const criarpostagemController = {
    salvar: async (req, res) => { // Adicione 'res' como parâmetro
        console.log("Função de postagem chamada");

        try {
            const errors = validationResult(req);
            console.log("Erros de validação:", errors.array());

            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, errors: errors.array() });
            }

            const dadosForm = {
                TITULO_POSTAGEM_PUBLICACOMU: req.body["input-text"], // Use colchetes para acessar o campo
                TIPO_DE_POSTAGEM: req.body.tipodepost,
                TOPICO_DE_POSTAGEM: req.body.topicodapost,
                ESCOLHA_COMUNIDADE: req.body.escolhacomunidade,
            };

            // Salva a imagem recebida
            const imagemFile = req.files.picture__input; // Verifique se 'req.files' está definido
            const imagemPath = path.join(__dirname, '..', 'uploads', `${Date.now()}_${imagemFile.name}`);
            console.log("Erros de validação:", errors.array());

            // Escreve a imagem no servidor
            fs.writeFileSync(imagemPath, imagemFile.data); // Salva a imagem

            dadosForm.IMAGEM = imagemPath; // Adiciona o caminho da imagem aos dados

            // Aqui você deve chamar a função para salvar a postagem no banco de dados
            const novaPostagem = await Postagem.create(dadosForm);
            console.log("Erros de validação:", errors.array());


            return res.status(201).json({ success: true, postagem: novaPostagem });
        } catch (error) {
            console.error("Erro ao criar postagem:", error);
            return res.status(500).json({ success: false, message: "Erro ao criar postagem" });
        }
    }
};

module.exports = criarpostagemController;

    