// js/modules/carrinho.js
import { getCurrentSession, saveOrder } from './storage.js'; // Importe saveOrder e getCurrentSession

let cartModal, openCartBtn, closeCartBtn, cartItemsContainer, cartTotalPriceEl;
let cart = [];

function renderCart() {
    cartItemsContainer.innerHTML = '';
    let totalPrice = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="cart-empty">Seu carrinho está vazio.</p>';
        cartTotalPriceEl.textContent = 'Total: R$ 0,00';
        return;
    }

    cart.forEach((item, index) => {
        const itemTotalPrice = item.price * item.quantity;
        totalPrice += itemTotalPrice;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <span class="cart-item-name">${item.name} (x${item.quantity})</span>
                <span class="cart-item-price">R$ ${itemTotalPrice.toFixed(2).replace('.', ',')}</span>
            </div>
            <div class="cart-item-actions">
                <button class="remove-btn" data-index="${index}">Remover</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    cartTotalPriceEl.textContent = `Total: R$ ${totalPrice.toFixed(2).replace('.', ',')}`;
}

export function addToCart(itemToAdd) {
    cart.push(itemToAdd);
    renderCart();
    openCartModal();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    renderCart();
}

function openCartModal() {
    cartModal.style.display = 'flex';
}

function closeCartModal() {
    cartModal.style.display = 'none';
}

export function initializeCart() {
    cartModal = document.getElementById('cartModal');
    openCartBtn = document.getElementById('open-cart-btn');
    closeCartBtn = document.querySelector('#cartModal .close-button');
    cartItemsContainer = document.getElementById('cart-items-container');
    cartTotalPriceEl = document.getElementById('cart-total-price');
    const finalizeOrderBtn = document.querySelector('#cart-footer button');

    openCartBtn.addEventListener('click', openCartModal);
    closeCartBtn.addEventListener('click', closeCartModal);

    window.addEventListener('click', (event) => {
        if (event.target === cartModal) {
            closeCartModal();
        }
    });

    cartItemsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-btn')) {
            const index = parseInt(event.target.dataset.index, 10);
            removeFromCart(index);
        }
    });

    // --- LÓGICA DE FINALIZAR PEDIDO ATUALIZADA ---
    finalizeOrderBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Seu carrinho está vazio!');
            return;
        }

        // Verifica autenticação
        const user = getCurrentSession();
        if (!user) {
            alert('Por favor, faça login para finalizar o pedido.');
            closeCartModal();
            document.getElementById('open-login').click(); // Abre modal de login
            return;
        }

        // Calcula total
        const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

        // Cria o objeto do pedido
        const newOrder = {
            id: Date.now(),
            userEmail: user.email,
            userName: user.name,
            items: [...cart], // Cópia do carrinho
            total: total,
            date: new Date().toISOString(),
            status: 'Recebido' // Status inicial
        };

        // Salva
        saveOrder(newOrder);

        alert(`Pedido realizado com sucesso!\nValor Total: R$ ${total.toFixed(2).replace('.', ',')}`);

        // Limpa carrinho e fecha
        cart = [];
        renderCart();
        closeCartModal();
    });

    renderCart();
}