// js/modules/carrinho.js

// Referências aos elementos do DOM
let cartModal, openCartBtn, closeCartBtn, cartItemsContainer, cartTotalPriceEl;

// O estado do nosso carrinho
let cart = [];

/**
 * Renderiza os itens do carrinho no modal e atualiza o preço total.
 */
function renderCart() {
    // Limpa o container antes de renderizar
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


/**
 * Adiciona um item ao carrinho. Se o item já existir, atualiza a quantidade.
 * @param {object} itemToAdd - O objeto do item a ser adicionado.
 */
export function addToCart(itemToAdd) {
    // Simples adição, sem verificar duplicados por enquanto para manter a lógica clara
    cart.push(itemToAdd);
    renderCart(); // Re-renderiza o carrinho com o novo item
    openCartModal(); // Abre o carrinho para o usuário ver o que foi adicionado
}

/**
 * Remove um item do carrinho pelo seu índice.
 * @param {number} index - O índice do item a ser removido.
 */
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


/**
 * Inicializa o módulo do carrinho, pegando referências do DOM e adicionando listeners.
 */
export function initializeCart() {
    cartModal = document.getElementById('cartModal');
    openCartBtn = document.getElementById('open-cart-btn');
    closeCartBtn = document.querySelector('#cartModal .close-button');
    cartItemsContainer = document.getElementById('cart-items-container');
    cartTotalPriceEl = document.getElementById('cart-total-price');
    const finalizeOrderBtn = document.querySelector('#cart-footer button'); // Pega o botão de finalizar

    openCartBtn.addEventListener('click', openCartModal);
    closeCartBtn.addEventListener('click', closeCartModal);

    window.addEventListener('click', (event) => {
        if (event.target === cartModal) {
            closeCartModal();
        }
    });

    // Listener para os botões de remover (usa delegação de eventos)
    cartItemsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-btn')) {
            const index = parseInt(event.target.dataset.index, 10);
            removeFromCart(index);
        }
    });

    // Listener para o botão de finalizar pedido
    finalizeOrderBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Seu carrinho está vazio!');
            return;
        }

        const totalPriceText = cartTotalPriceEl.textContent;
        alert(`Pedido finalizado!\n${totalPriceText}`);

        // Limpa o carrinho
        cart = [];
        renderCart();
        closeCartModal();
    });

    // Renderiza o carrinho inicialmente (para mostrar a mensagem de vazio)
    renderCart();
}