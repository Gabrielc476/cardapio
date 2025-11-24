// js/modules/auth.js
import { getUsers, saveUser, loginUserSession, getCurrentSession, logoutUserSession } from './storage.js';

export function initializeAuth() {
    // ... (Seletores existentes)
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const openLoginBtn = document.getElementById('open-login');
    const openRegisterBtn = document.getElementById('open-register');
    const userIcon = document.getElementById('user-icon');
    const openAdminBtn = document.getElementById('open-admin-btn');
    
    // Novo Botão
    const openOrdersBtn = document.getElementById('open-orders-btn');

    // ... (Demais seletores: closeButtons, forms, switch...)
    const closeButtons = document.querySelectorAll('.modal .close-button');
    const switchToRegister = document.getElementById('switchToRegister');
    const switchToLogin = document.getElementById('switchToLogin');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    function openModal(modal) { modal.style.display = 'flex'; }
    function closeModal(modal) { modal.style.display = 'none'; }

    function updateAuthUI() {
        const user = getCurrentSession();
        
        // Estado padrão: esconde botões restritos
        if (openAdminBtn) openAdminBtn.style.display = 'none';
        if (openOrdersBtn) openOrdersBtn.style.display = 'none'; // Esconde pedidos

        if (user) {
            // LOGADO
            openLoginBtn.style.display = 'none';
            openRegisterBtn.style.display = 'none';
            
            userIcon.style.display = 'inline-flex';
            userIcon.style.alignItems = 'center';
            userIcon.style.justifyContent = 'center';
            userIcon.textContent = `👤 ${user.name.split(' ')[0]}`;
            userIcon.title = "Clique para sair";
            
            // MOSTRA BOTÃO DE PEDIDOS
            if (openOrdersBtn) openOrdersBtn.style.display = 'inline-block';

            if (user.role === 'admin' && openAdminBtn) {
                openAdminBtn.style.display = 'inline-block';
            }

        } else {
            // NÃO LOGADO
            openLoginBtn.style.display = 'inline-block';
            openRegisterBtn.style.display = 'inline-block';
            userIcon.style.display = 'none';
        }
    }

    // ... (Mantém o resto do código de eventos: userIcon click, loginForm submit, etc.)
    userIcon.addEventListener('click', () => {
        if (confirm('Deseja sair da sua conta?')) {
            logoutUserSession();
            updateAuthUI();
            window.location.reload();
        }
    });
    
    openLoginBtn.addEventListener('click', () => openModal(loginModal));
    openRegisterBtn.addEventListener('click', () => openModal(registerModal));

    closeButtons.forEach(button => {
        button.addEventListener('click', (e) => closeModal(e.target.closest('.modal')));
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
        if (event.target === loginModal) closeModal(loginModal);
        if (event.target === registerModal) closeModal(registerModal);
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const users = getUsers();
        const validUser = users.find(u => u.email === email && u.password === password);
        if (validUser) {
            loginUserSession(validUser);
            updateAuthUI();
            closeModal(loginModal);
            document.getElementById('login-email').value = '';
            document.getElementById('login-password').value = '';
        } else {
            alert('Email ou senha incorretos!');
        }
    });

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const users = getUsers();
        if (users.some(u => u.email === email)) {
            alert('Este email já está cadastrado!');
            return;
        }
        const newUser = { name, email, password };
        saveUser(newUser);
        loginUserSession({ ...newUser, role: 'user' });
        updateAuthUI();
        closeModal(registerModal);
        document.getElementById('register-name').value = '';
        document.getElementById('register-email').value = '';
        document.getElementById('register-password').value = '';
        alert('Cadastro realizado com sucesso!');
    });

    updateAuthUI();
}