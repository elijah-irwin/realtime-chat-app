const socket = io();
const $userList = document.querySelector('.user-list');
const $user = document.querySelector('.users');
const $chatbox = document.querySelector('.chatbox');
const $messageInput = document.querySelector('.msg-input');
const $sendMessageBtn = document.querySelector('.send-btn');
const username = localStorage.getItem('username');

// Socket Stuff
if (username) {
    socket.emit('new-user', username);
} else {
    window.location.pathname = '/';
}

socket.on('new-user', ({users, messages}) => {
    $userList.innerHTML = buildUserList(users);
    $chatbox.innerHTML = buildMessages(messages);
    $chatbox.scrollTop = $chatbox.scrollHeight;
});

socket.on('new-message', message => {
    const html = messageTemplate(message);
    $chatbox.insertAdjacentHTML('beforeend', html);
    autoScroll();
});

socket.on('user-disconnect', users => {
    $userList.innerHTML = buildUserList(users);
});


// Event Listeners
$sendMessageBtn.addEventListener('click', () => {
    sendMessage($messageInput.value);
    
});

$messageInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
        sendMessage($messageInput.value);
    }
});


// Utils
const buildUserList = users => {
    let html = '';
    for (const user of users) {
        html += `<div class="users">${user.username}</div>`
    }
    
    return html;
};

const buildMessages = messages => {
    let html = '';
    for (const message of messages) {
        html += messageTemplate(message);
    }

    return html;
};

const sendMessage = msg => {
    if (msg === '') return;

    const message = {
        username,
        message: msg
    }
    socket.emit('new-message', message)
    $messageInput.value = '';
};

const autoScroll = () => {
    const $latestMessage = $chatbox.lastElementChild;
    if (!$latestMessage) return;

    const height = $latestMessage.offsetHeight;
    const visHeight = $chatbox.offsetHeight; 
    const containerHeight = $chatbox.scrollHeight;
    const scrollOffset = $chatbox.scrollTop + visHeight + 10;
    
    if (containerHeight - height <= scrollOffset) {
        $chatbox.scrollTop = $chatbox.scrollHeight;
    }
};

const messageTemplate = message => {
    return `
        <div>
            <div class="message-user">${message.username} - ${message.time}</div>
            <div class="message"> > ${message.message}</div>
        </div>
    `;
};



