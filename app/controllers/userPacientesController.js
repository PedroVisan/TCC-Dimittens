const paciente = require("../models/pacienteModel");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);

const userPacientesController = {
    cadastrar: async (req) => {
        console.log("Função de cadastro chamada");

        try {
            const errors = validationResult(req);
            console.log("Erros de validação:", errors.array());

            if (!errors.isEmpty()) {
                return { success: false, errors: errors.array() };
            }

            const dadosForm = {
                NOME_USUARIO: req.body.username,
                SENHA_USUARIO: bcrypt.hashSync(req.body.userpassword, salt),
                DT_NASC_USUARIO: req.body.userdate,
                EMAIL_USUARIO: req.body.useremail,
                CPF_USUARIO: req.body.userdocuments,
                DT_CRIACAO_CONTA_USUARIO: new Date(),
                DIFERENCIACAO_USUARIO: "Comum",
            };

            const existingEmails = await paciente.findAllEmails();
            const emailDuplicado = existingEmails.find(
                (email) => email === req.body.useremail
            );

            if (emailDuplicado) {
                console.log("Email duplicado encontrado:", emailDuplicado);
                return {
                    success: false,
                    errors: [{ msg: "Email já cadastrado" }],
                };
            }

            const resultado = await paciente.create(dadosForm);
            if (!resultado || !resultado.insertId) {
                throw new Error("Erro ao inserir o novo usuário.");
            }

            console.log("Paciente cadastrado com sucesso!", dadosForm);

            // Alinhar a estrutura da sessão com o login
            req.session.autenticado = {
                usuarioNome: req.body.username,
                usuarioId: resultado.insertId,
                tipo: "Comum",
            };
            console.log("Sessão de usuário criada:", req.session.autenticado);

            return { success: true };
        } catch (error) {
            console.error("Erro ao cadastrar:", error);
            return { success: false, errors: [{ msg: "Erro no servidor." }] };
        }
    },

    logar: async (req) => {
        try {
            const errors = validationResult(req); // Validação dos inputs
            let errorsList = {};
    
            // Acumular erros de validação inicial
            if (!errors.isEmpty()) {
                errors.array().forEach((error) => {
                    errorsList[error.param] = error.msg;
                });
            }
    
            const dadosForm = {
                CPF_USUARIO: req.body.userdocuments,
                SENHA_USUARIO: req.body.userpassword,
            };
    
            const findUserCPF = await paciente.findUserCPF(dadosForm);
    
            // Verifica se o CPF foi encontrado
            if (findUserCPF.length !== 1) {
                errorsList.userdocuments = 'CPF não encontrado.';
            } else {
                const usuario = findUserCPF[0];
    
                // Verifica se a senha é válida
                const senhaValida = await bcrypt.compare(
                    dadosForm.SENHA_USUARIO,
                    usuario.SENHA_USUARIO
                );
    
                if (!senhaValida) {
                    errorsList.userpassword = 'Senha incorreta.';
                }
            }
    
            // Se houver erros, retorna todos de uma vez
            if (Object.keys(errorsList).length > 0) {
                console.log('Erros encontrados:', errorsList); // Log dos erros
                return { success: false, errors: errorsList };
            }
    
            // Retorna sucesso e os dados do usuário
            console.log("Paciente logado com sucesso!");
            return { success: true, usuario: findUserCPF[0] };
    
        } catch (error) {
            console.error("Erro no login:", error);
            return { success: false, errors: { geral: 'Erro no servidor.' } };
        }
    }
};

module.exports = userPacientesController;
