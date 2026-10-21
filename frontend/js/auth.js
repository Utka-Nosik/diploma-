const loginForm = document.querySelector('#login-form');
const formError = document.querySelector('#form-error');
const signupLink = document.querySelector('#signup-link');

loginForm?.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!loginForm.reportValidity()) {
        formError.hidden = false;
        return;
    }

    const email = new FormData(loginForm).get('email').toString().trim();
    const username = email.split('@')[0].replace(/[._-]+/g, ' ').trim() || 'Мой профиль';
    const displayName = username.replace(/(^|\s)\S/g, (letter) => letter.toLocaleUpperCase('ru-RU'));

    sessionStorage.setItem('artex-demo-user', JSON.stringify({ email, displayName }));
    window.location.href = 'profile.html';
});

loginForm?.addEventListener('input', () => {
    formError.hidden = true;
});

signupLink?.addEventListener('click', (event) => {
    event.preventDefault();
    document.querySelector('#demo-note')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
});
