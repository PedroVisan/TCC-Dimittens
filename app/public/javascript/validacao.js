var form = document.getElementById('cadastroForm');

// Seleciona os campos de CPF e CRP corretamente
var cpfInputs = [
    document.getElementById('userdocuments'),
    document.getElementById('userresponsaveldocuments')
].filter(Boolean);  // Remove valores nulos

var crpInput = document.getElementById('usercrp');  // Campo de CRP, se existir

// Aplica formatação para CPF
cpfInputs.forEach(function (input) {
    input.addEventListener('input', function (e) {
        let cpf = e.target.value.replace(/\D/g, '');
        if (cpf.length > 11) cpf = cpf.slice(0, 11);
        cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4');
        e.target.value = cpf;
    });
});

// Aplica formatação para CRP
if (crpInput) {
    crpInput.addEventListener('input', function (e) {
        let crp = e.target.value.replace(/\D/g, '');
        if (crp.length > 8) crp = crp.slice(0, 8);
        crp = crp.replace(/(\d{2})(\d{0,6})/, '$1/$2');
        e.target.value = crp;
    });
}

// Validação na submissão do formulário
form.addEventListener('submit', function (event) {
    var hasError = false;
    var routeToCadastromenor = false;

    var inputs = [
        { 
            element: document.getElementById('username'), 
            minLength: 5, 
            errorMessageEmpty: 'O nome é obrigatório.', 
            errorMessageMinLength: 'O nome deve ter pelo menos 5 caracteres.' 
        },
        { 
            element: document.getElementById('userdate'), 
            optional: true, 
            errorMessageEmpty: 'A data de nascimento é obrigatória.', 
            errorMessageInvalidAge: 'A idade deve ser maior ou igual a 18 anos.' 
        },
        { 
            element: document.getElementById('userdatemenor'), 
            optional: true, 
            errorMessageEmpty: 'A data de nascimento é obrigatória.', 
            errorMessageInvalidAge: 'A idade deve ser entre 6 e 17 anos.' 
        },
        { 
            element: document.getElementById('userdocuments'), 
            errorMessageEmpty: 'O CPF é obrigatório.', 
            errorMessageInvalidCpf: 'CPF inválido.' 
        },
        { 
            element: document.getElementById('usercrp'), 
            optional: true, 
            errorMessageEmpty: 'O CRP é obrigatório.', 
            errorMessageInvalidCrp: 'CRP inválido.' 
        },
        { 
            element: document.getElementById('useremail'), 
            errorMessageEmpty: 'O email é obrigatório.', 
            errorMessageInvalidEmail: 'Por favor, insira um email válido.' 
        },
        { 
            element: document.getElementById('userpassword'), 
            minLength: 8, 
            errorMessageEmpty: 'A senha é obrigatória.', 
            errorMessageMinLength: 'A senha deve ter pelo menos 8 caracteres.', 
            errorMessageWeak: 'A senha deve conter pelo menos um número, uma letra maiúscula e um caractere especial.' 
        },
        { 
            element: document.getElementById('usercpassword'), 
            errorMessageEmpty: 'A confirmação de senha é obrigatória.', 
            errorMessageMatch: 'As senhas não coincidem.' 
        }
    ];

    inputs.forEach(inputData => {
        var input = inputData.element;
        if (!input) return;

        var value = input.value.trim();
        var warningSpan = input.nextElementSibling;

        input.style.border = '';
        warningSpan.textContent = '';

        if (value === '') {
            hasError = true;
            input.style.border = '1px solid red';
            warningSpan.textContent = inputData.errorMessageEmpty;
        } else if (inputData.minLength && value.length < inputData.minLength) {
            hasError = true;
            input.style.border = '1px solid red';
            warningSpan.textContent = inputData.errorMessageMinLength;
        } else if (input.id === 'userdate' && !isValidAdult(value)) {
            routeToCadastromenor = true;
        } else if (input.id === 'userdatemenor' && !isValidMinor(value)) {
            hasError = true;
            input.style.border = '1px solid red';
            warningSpan.textContent = inputData.errorMessageInvalidAge;
        } else if (input.id === 'useremail' && !isValidEmail(value)) {
            hasError = true;
            input.style.border = '1px solid red';
            warningSpan.textContent = inputData.errorMessageInvalidEmail;
        } else if (input.id === 'userpassword' && !isStrongPassword(value)) {
            hasError = true;
            input.style.border = '1px solid red';
            warningSpan.textContent = inputData.errorMessageWeak;
        } else if (input.id === 'usercpassword' && value !== document.getElementById('userpassword').value.trim()) {
            hasError = true;
            input.style.border = '1px solid red';
            warningSpan.textContent = inputData.errorMessageMatch;
        }
    });

    cpfInputs.forEach(function (input) {
        let cpfValue = input.value.trim();
        let warningSpan = input.nextElementSibling;

        input.style.border = '';
        warningSpan.textContent = '';

        if (!validarCpf(cpfValue)) {
            hasError = true;
            input.style.border = '1px solid red';
            warningSpan.textContent = 'CPF inválido.';
        }
    });

    if (hasError) {
        event.preventDefault();
    } else if (routeToCadastromenor) {
        event.preventDefault();
        window.location.href = '/cadastromenor';
    }
});

// Função para verificar se o usuário é maior de 18 anos
function isValidAdult(birthDate) {
    var age = calculateAge(birthDate);
    return age >= 18;
}

// Função para verificar se o usuário é menor entre 6 e 17 anos
function isValidMinor(birthDate) {
    var age = calculateAge(birthDate);
    return age >= 6 && age <= 17;
}

// Função para calcular idade
function calculateAge(birthDate) {
    var today = new Date();
    var birth = new Date(birthDate);
    var age = today.getFullYear() - birth.getFullYear();
    var monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    return age;
}

// Função para validar email
function isValidEmail(email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Função para validar senha forte
function isStrongPassword(password) {
    var passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    return passwordRegex.test(password);
}

// Função para validar CPF
function validarCpf(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    var soma = 0, resto;
    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(cpf.substring(10, 11));
}
