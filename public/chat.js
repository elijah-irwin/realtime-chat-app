const socket = io();
const $userList = document.querySelector('.user-list');
const $user = document.querySelector('.users');
const $chatbox = document.querySelector('.chatbox');
const $messageInput = document.querySelector('.msg-input');
const $sendMessageBtn = document.querySelector('.send-btn');


// Socket Stuff
socket.on('new-user', ({users, messages}) => {
    $userList.innerHTML = buildUserList(users);
    $chatbox.innerHTML = buildMessages(messages);
});

socket.on('new-message', message => {
    console.log(message);
    const html = `
        <div class="message-user">${message.user} - ${message.time}</div>
        <div class="message">${message.message}</div>
    `;
    $chatbox.insertAdjacentHTML('beforeend', html);
});

socket.on('user-disconnect', users => {
    $userList.innerHTML = buildUserList(users);
});


// Event Listeners
$sendMessageBtn.addEventListener('click', () => {
    socket.emit('new-message', $messageInput.value)
    $messageInput.value = '';
});

$messageInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
        socket.emit('new-message', $messageInput.value);
        $messageInput.value = '';
    }
});


// Utils
const buildUserList = users => {
    let html = '';
    for (const user of users) {
        html += `<div class="users">${user}</div>`
    }
    
    return html;
};

const buildMessages = messages => {
    let html = '';
    for (const message of messages) {
        html += `
            <div class="message-user">${message.user} - ${message.time}</div>
            <div class="message">${message.message}</div>
        `;
    }

    return html;
}


