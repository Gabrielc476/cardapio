// js/auth.js

export function initializeAuth() {
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const openLoginBtn = document.getElementById('open-login');
    const openRegisterBtn = document.getElementById('open-register');
    const closeButtons = document.querySelectorAll('.modal .close-button');
    const switchToRegister = document.getElementById('switchToRegister');
    const switchToLogin = document.getElementById('switchToLogin');
    const userIcon = document.getElementById('user-icon');

    function openModal(modal) {
        modal.style.display = 'flex';
    }

    function closeModal(modal) {
        modal.style.display = 'none';
    }

    function showUserIcon() {
        openLoginBtn.style.display = 'none';
        openRegisterBtn.style.display = 'none';
        userIcon.style.display = 'inline-block'; // ou 'flex'
    }

    openLoginBtn.addEventListener('click', () => openModal(loginModal));
    openRegisterBtn.addEventListener('click', () => openModal(registerModal));

    closeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            closeModal(e.target.closest('.modal'));
        });
    });

    switchToRegister.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(loginModal);
        openModal(registerModal);
    });

    switchToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(registerModal);
        openModal(loginModal);
    });

    window.addEventListener('click', (event) => {
        if (event.target === loginModal) {
            closeModal(loginModal);
        }
        if (event.target === registerModal) {
            closeModal(registerModal);
        }
    });

    // Lógica para fechar os modais no envio do formulário
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Aqui você adicionaria a lógica de autenticação real
        closeModal(loginModal);
        showUserIcon(); // Mostra o ícone do usuário
    });

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Aqui você adicionaria a lógica de registro real
        closeModal(registerModal);
        showUserIcon(); // Mostra o ícone do usuário
    });
}