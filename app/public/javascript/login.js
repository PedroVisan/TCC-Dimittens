document.getElementById('loginForm').addEventListener('submit', function(event) {
    var isValid = true;

    var userCpf = document.getElementById('usercpf');
    var userPassword = document.getElementById('userpassword');

    userCpf.classList.remove('error');
    userPassword.classList.remove('error');
    document.querySelectorAll('.warning').forEach(function(warning) {
        warning.textContent = '';
    });

    if (userCpf.value.trim() === '') {
        event.preventDefault();
        isValid = false;
        userCpf.classList.add('error');
        userCpf.nextElementSibling.textContent = 'O campo não pode estar vazio';
    }

    if (userPassword.value.trim() === '') {
        event.preventDefault();
        isValid = false;
        userPassword.classList.add('error');
        userPassword.nextElementSibling.textContent = 'O campo não pode estar vazio';
    }

    if (!isValid) {
        event.preventDefault();
    }

  
});