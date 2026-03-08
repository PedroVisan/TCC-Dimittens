/* Menu side-bar abertura no botão */

document.getElementById('open_btn').addEventListener('click', function () {
    document.getElementById('sidebar').classList.toggle('open-sidebar');
});


const messageInput = document.getElementById('message-input');
const submitBtn = document.getElementById('submitBtn');


messageInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendMessage();
    }
});

submitBtn.addEventListener('click', function() {
    sendMessage();
});


function sendMessage() {
    const messageText = messageInput.value.trim();

    if (messageText !== '') {
        const mainChat = document.getElementById('main-chat');
        if (mainChat) {
            const messageElement = document.createElement('section');
            messageElement.classList.add('mensagem-usuario-box');
            messageElement.innerHTML = `
                <section class="mensagem-usuario-content">
                    <p>${messageText}</p>
                </section>
            `;
            mainChat.appendChild(messageElement);

            messageInput.value = '';

            mainChat.scrollTop = mainChat.scrollHeight;
        }
    }
}

function showProfile(contactName) {
    document.getElementById('contact-name').innerText = contactName;
}

document.querySelectorAll('.chat li').forEach(item => {
    item.addEventListener('click', function() {
        showProfile(item.querySelector('h3').innerText);
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const chats = document.querySelectorAll(".chat ul li");
    const backButton = document.querySelector(".main .return");

    backButton.addEventListener("click", function() {
        document.querySelector(".main").classList.add("chat-leave"); 
        document.querySelector(".main").classList.remove("chat-enter");
    });

    chats.forEach(chat => {
        chat.addEventListener("click", function() {
            document.querySelector(".main").classList.remove("chat-leave"); 
            document.querySelector(".main").classList.add("chat-enter");
        });
    });
});
