const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const menorModel = require("../models/menorModel");
var salt = bcrypt.genSaltSync(10);

// Função para formatar a data
const formatarData = (data) => {
    return new Date(data).toISOString().split('T')[0]; // Formato yyyy-mm-dd
};

const userMenorController = {
    cadastrar: async (req, res) => {
        console.log("Função de cadastro chamada");
        const errors = validationResult(req);
        console.log("Erros de validação:", errors.array());

        if (!errors.isEmpty()) {
            return res.render("pages/index", {
                pagina: "cadastromenor",
                autenticado: null,
                errorsList: errors.array(),
                valores: req.body
            });
        }

        const dadosForm = {
            NOME_USUARIO: req.body.username,
            SENHA_USUARIO: bcrypt.hashSync(req.body.userpassword, salt),
            EMAIL_USUARIO: req.body.useremail,
            CPF_USUARIO: req.body.userdocuments,
            DT_NASC_USUARIO: formatarData(req.body.userdatemenor),
            CPF_RESPONSAVEL: req.body.userresponsaveldocuments,
            NOME_RESPONSAVEL: req.body.usernameresponsavel,
            DT_CRIACAO_CONTA_USUARIO: new Date(),
            DIFERENCIACAO_USUARIO: "Menor de Idade"
        };

        console.log("Dados recebidos:", dadosForm);

        try {
            const existingEmails = await menorModel.findAllEmails();
            const emailDuplicado = existingEmails.find(email => email === req.body.email);

            if (emailDuplicado) {
                console.log("Email duplicado encontrado:", emailDuplicado);
                return res.render("pages/index", {
                    pagina: "cadastromenor",
                    autenticado: null,
                    errorsList: [{ msg: "Email já cadastrado" }],
                    valores: req.body
                });
            }

            const resultado = await menorModel.create(dadosForm);
            if (!resultado || !resultado.insertId) {
                throw new Error("Erro ao inserir o novo usuário.");
            }

            console.log("Usuário menor cadastrado com sucesso!");

            // Guarda todas as informações relevantes na sessão
            req.session.autenticado = {
                usuarioNome: req.body.username,
                usuarioId: resultado.insertId,
                tipo: "Menor de Idade"
            };
            console.log("Sessão de usuário criada:", req.session.autenticado);

            return { success: true };
        } catch (error) {
            console.log("Erro ao cadastrar menor:", error);
            return res.render("pages/index", {
                pagina: "cadastromenor",
                autenticado: null,
                errorsList: [{ msg: "Erro ao cadastrar usuário." }],
                valores: req.body
            });
        }
    },

    logar: async (req) => {
        try {
            const errors = validationResult(req); // Valida os campos de entrada
            let errorsList = {}; // Armazena todos os erros
    
            // Acumula erros de validação inicial (se houver)
            if (!errors.isEmpty()) {
                errors.array().forEach((error) => {
                    errorsList[error.param] = error.msg;
                });
            }
    
            const dadosForm = {
                CPF_USUARIO: req.body.userdocuments,
                SENHA_USUARIO: req.body.userpassword,
                DT_NASC_USUARIO: formatarData(req.body.userdatemenor),
            };
    
            console.log("Dados recebidos para login:", dadosForm);
    
            const findUser = await menorModel.findUserCPF({ CPF_USUARIO: dadosForm.CPF_USUARIO });
    
            // Verifica se o CPF foi encontrado
            if (findUser.length === 0) {
                errorsList.userdocuments = 'CPF não encontrado.';
            } else {
                const usuario = findUser[0];
    
                // Verifica se a senha é válida
                const senhaValida = await bcrypt.compare(
                    dadosForm.SENHA_USUARIO,
                    usuario.SENHA_USUARIO
                );
    
                if (!senhaValida) {
                    errorsList.userpassword = 'Senha incorreta.';
                }
    
                // Verifica se a data de nascimento coincide
                const dataNascBanco = formatarData(usuario.DT_NASC_USUARIO);
                const dataNascForm = dadosForm.DT_NASC_USUARIO;
    
                if (dataNascBanco !== dataNascForm) {
                    errorsList.userdatemenor = 'Data de nascimento incorreta.';
                }
            }
    
            // Se houver erros, retorna todos os erros encontrados
            if (Object.keys(errorsList).length > 0) {
                console.log('Erros encontrados:', errorsList);
                return { success: false, errors: errorsList };
            }
    
            console.log("Login bem-sucedido para menor de idade.");
            return { success: true, usuario: findUser[0] };
    
        } catch (error) {
            console.error("Erro no login menor:", error);
            return { success: false, errors: { geral: 'Erro no servidor.' } };
        }
    }
};

module.exports = userMenorController;
