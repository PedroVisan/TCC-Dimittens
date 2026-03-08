const { validationResult } = require("express-validator");
const paciente = require("./pacienteModel.js");
const bcrypt = require("bcryptjs");

// Middleware para verificar se o usuário está autenticado
verificarAutenticacao = (req, res, next) => {
    if (req.session && req.session.autenticado) {
        console.log("Usuário autenticado:", req.session.autenticado);
        res.locals.usuarioNome = req.session.autenticado.usuarioNome; // Disponível para as views
        next(); // Continua para a rota desejada
    } else {
        console.log("Usuário não autenticado.");
        res.locals.usuarioNome = null; // Limpa dados nas views
        return res.redirect("/loginpacientes"); // Redireciona para o login
    }
};

// Middleware para verificar se o usuário é um psicólogo autenticado com CRP
checkAuthenticatedPsicologo = (req, res, next) => {
    // Verifica se a sessão do usuário está autenticada
    if (!req.session.autenticado) {
        console.log("Acesso negado. Sessão inválida.");
        return res.redirect("/loginpsicologos"); // Redireciona para login se não autenticado
    }

    // Verifica se o tipo do usuário na sessão é "psicologo"
    if (req.session.autenticado.tipo?.toLowerCase() !== "psicologo") {
        console.log("Acesso negado. Usuário não é psicólogo.");
        return res.redirect("/loginpsicologos"); // Redireciona se o tipo não for "psicologo"
    }

    // Prossegue para a rota desejada se o usuário for um psicólogo autenticado
    next();
};
// Middleware para limpar a sessão
clearSession = (req, res) => {
    console.log("Sessão antes de limpar:", req.session);
    req.session.destroy(() => {
        console.log("Sessão destruída, usuário saiu.");
        res.redirect("/"); // Redireciona para a página inicial
    });
};

// Middleware para registrar o usuário autenticado
 recordAuthenticatedUser = async (req, res, next) => {
    console.log("Entrou no middleware de registro do usuário");
    const errors = validationResult(req);
    console.log("Erros de validação:", errors.array());

    if (errors.isEmpty()) {
        try {
            const dadosForm = {
                CPF_USUARIO: req.body.userdocuments,
                SENHA_USUARIO: req.body.userpassword,
            };

            // Busca o usuário pelo CPF
            const results = await paciente.findUserCPF(dadosForm);
            console.log("Resultados da busca:", results);

            if (results.length === 0) {
                console.log("Nenhum usuário encontrado com o CPF fornecido.");
                return res.render("pages/index", {
                    pagina: "loginpacientes",
                    autenticado: null,
                    errorsList: [{ msg: "CPF não encontrado." }],
                });
            }

            const usuario = results[0];

            // Comparação de senha usando bcrypt
            const senhaValida = await bcrypt.compare(dadosForm.SENHA_USUARIO, usuario.SENHA_USUARIO);
            if (!senhaValida) {
                console.log("Senha incorreta.");
                return res.render("pages/index", {
                    pagina: "loginpacientes",
                    autenticado: null,
                    errorsList: [{ msg: "Credenciais inválidas." }],
                });
            }

            console.log("Login bem-sucedido! Nome do usuário:", usuario.NOME_USUARIO);

            // Armazenando informações do usuário na sessão
            req.session.autenticado = {
                usuarioNome: usuario.NOME_USUARIO,
                usuarioId: usuario.ID_USUARIO,
                
                tipo: usuario.DIFERENCIACAO_USUARIO,
            };

            console.log("Sessão após login:", req.session.autenticado);
            return res.redirect("/homelogged");

        } catch (error) {
            console.error("Erro ao registrar o usuário autenticado:", error);
            return res.render("pages/index", {
                pagina: "loginpacientes",
                autenticado: null,
                errorsList: [{ msg: "Erro no servidor." }],
            });
        }
    } else {
        console.log("Erros de validação:", errors.array());
        return res.render("pages/index", {
            pagina: "loginpacientes",
            autenticado: null,
            errorsList: errors.array(),
        });
    }
};

// Exportando os middlewares
module.exports = {
    verificarAutenticacao,
    checkAuthenticatedPsicologo,
    clearSession,
    recordAuthenticatedUser,
};
