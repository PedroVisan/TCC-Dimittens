const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // Certifique-se de que o caminho para db.js está correto

const Postagem = sequelize.define('Postagem', {
    TITULO_POSTAGEM_PUBLICACOMU: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    TIPO_DE_POSTAGEM: {
        type: DataTypes.ENUM('pergunta', 'enquete'),
        allowNull: false,
    },
    TOPICO_DE_POSTAGEM: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    ESCOLHA_COMUNIDADE: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    IMAGEM: {
        type: DataTypes.STRING, // Aqui armazenaremos o caminho da imagem
        allowNull: false,
    },
    CRIADO_EM: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
});

Postagem.sync()
    .then(() => console.log("Tabela de Postagem criada com sucesso!"))
    .catch((error) => console.error("Erro ao criar tabela de Postagem:", error));

module.exports = Postagem;