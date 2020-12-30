const username = localStorage.getItem('username');
const $form = document.querySelector('.username-form');

if (username) {
    window.location.pathname = '/chat';
} 

$form.addEventListener('submit', e => {
    e.preventDefault();
    localStorage.setItem('username', $form.user.value);
    window.location.pathname = '/chat';
});

