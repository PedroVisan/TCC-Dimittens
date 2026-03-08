const editarPerfilModel = require("../models/editarPerfilModel");
const bcrypt = require("bcryptjs");

const editarPerfilController = {
    editarPerfilPage: async (req, res) => {
        // Função para renderizar a página de edição de perfil
        const session = req.session?.autenticado;

        if (!session) {
            console.log("Sessão não encontrada, redirecionando para o login.");
            return res.redirect("/loginpsicologos");
        }

        const { usuarioId, tipo } = session;

        try {
            const valores = await editarPerfilModel.getProfileData(usuarioId, tipo);

            if (!valores) {
                console.log("Nenhum dado encontrado para o usuário.");
                return res.status(404).render("erro", { mensagem: "Perfil não encontrado." });
            }

            console.log("Dados do perfil carregados:", valores);
            res.render("partial/editeseuperfilpsic", { valores });
        } catch (error) {
            console.error("Erro ao carregar os dados do perfil:", error);
            res.status(500).render("erro", { mensagem: "Erro ao carregar os dados do perfil." });
        }
    },

    editarPerfil: async (req, res) => {
        // Função para atualizar o perfil
        const {
            nome, emailpsic, tel, crp, abordagem, especialidade, biografiapsic,
            publico, valor, imagemPerfil
        } = req.body;

        const idUsuario = req.session?.autenticado?.usuarioId;

        if (!idUsuario) {
            return res.status(400).json({ error: "Usuário não autenticado" });
        }

        try {
            const data = {
                NOME_USUARIO: nome,
                EMAIL_USUARIO: emailpsic,
                TEL_USUARIO: tel,
                CRP_USUARIO: crp,
                ABORDAGEM_ABRANGENTE_USUARIO: abordagem,
                ESPECIALIDADE_PSICOLOGO: especialidade,
                BIOGRAFIA_PSICOLOGO: biografiapsic,
                PUBLICO_ALVO_PSICOLOGO: publico,
                VALOR_CONSULTA_PSICOLOGO: valor,
                IMAGEM_PERFIL: imagemPerfil,
                idUsuario,
            };

            const success = await editarPerfilModel.updateProfile(data);

            if (success) {
                res.redirect("/perfilpsic");
            } else {
                res.status(500).json({ error: "Erro ao atualizar perfil" });
            }
        } catch (error) {
            console.error("Erro ao atualizar perfil:", error);
            res.status(500).json({ error: "Erro ao atualizar perfil" });
        }
    },
};

module.exports = editarPerfilController;
