// js/modules/carrinho.js
import { getCurrentSession, saveOrder } from './storage.js';
import { mockGeocodeAddress, getDistanceFromLatLonInKm, BASE_LAT, BASE_LNG } from './drivers.js';

let cartModal, openCartBtn, closeCartBtn, cartItemsContainer, cartTotalPriceEl, cartFooter;
let cart = [];

// Elementos novos do delivery
let addressInput, deliveryInfoContainer, finalizeBtn;

function renderCart() {
    cartItemsContainer.innerHTML = '';
    let itemsTotal = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="cart-empty">Seu carrinho está vazio.</p>';
        cartTotalPriceEl.textContent = 'Total: R$ 0,00';
        if(deliveryInfoContainer) deliveryInfoContainer.style.display = 'none';
        return;
    }

    // Renderiza itens
    cart.forEach((item, index) => {
        const itemTotalPrice = item.price * item.quantity;
        itemsTotal += itemTotalPrice;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <span class="cart-item-name">${item.name} (x${item.quantity})</span>
                <span class="cart-item-price">R$ ${itemTotalPrice.toFixed(2).replace('.', ',')}</span>
            </div>
            <button class="remove-btn" data-index="${index}">Remover</button>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    // Se o container de delivery existir, calcula com base no input atual
    if (deliveryInfoContainer) {
        deliveryInfoContainer.style.display = 'block';
        calculateDeliveryTotals(itemsTotal);
    } else {
        // Fallback se ainda não foi inicializado o DOM do delivery
        cartTotalPriceEl.textContent = `Total: R$ ${itemsTotal.toFixed(2).replace('.', ',')}`;
    }
}

/**
 * Calcula totais com frete e atualiza a UI
 */
function calculateDeliveryTotals(itemsTotal) {
    const address = addressInput.value.trim();
    let deliveryFee = 0;
    let deliveryTime = 0;
    let distance = 0;

    if (address.length > 3) {
        // 1. Obter coordenadas simuladas do cliente
        const coords = mockGeocodeAddress(address);

        // 2. Calcular distância até a loja
        distance = getDistanceFromLatLonInKm(coords.lat, coords.lng, BASE_LAT, BASE_LNG);

        // 3. Calcular Taxa: R$ 5,00 a cada 2km (arredondando para cima)
        // Ex: 0.5km -> 1 bloco de 2km -> R$ 5
        // Ex: 2.1km -> 2 blocos de 2km -> R$ 10
        deliveryFee = Math.ceil(distance / 2) * 5;

        // 4. Calcular Tempo Estimado: 30 min base + 5 min por km
        deliveryTime = 30 + Math.ceil(distance * 5);
    }

    const finalTotal = itemsTotal + deliveryFee;

    // Atualiza UI
    const feeDisplay = document.getElementById('delivery-fee-display');
    const timeDisplay = document.getElementById('delivery-time-display');
    
    if (address.length > 3) {
        feeDisplay.textContent = `+ Frete (${distance.toFixed(1)}km): R$ ${deliveryFee.toFixed(2).replace('.', ',')}`;
        feeDisplay.style.color = '#ffaf50';
        timeDisplay.textContent = `Tempo estimado: ${deliveryTime} min`;
    } else {
        feeDisplay.textContent = 'Digite o endereço para calcular o frete';
        feeDisplay.style.color = '#888';
        timeDisplay.textContent = '';
    }

    cartTotalPriceEl.textContent = `Total Final: R$ ${finalTotal.toFixed(2).replace('.', ',')}`;
    
    // Retorna valores para uso no finalize
    return { deliveryFee, deliveryTime, finalTotal, distance };
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
    cartFooter = document.getElementById('cart-footer');
    
    // INJETANDO HTML DO DELIVERY NO FOOTER DO CARRINHO
    // Limpa o footer original para reconstruir com input de endereço
    cartFooter.innerHTML = '';
    
    // Criação dos elementos de UI do Delivery dinamicamente
    const deliveryHTML = `
        <div id="delivery-info-container" style="margin-bottom: 15px; border-top: 1px solid #333; padding-top: 15px;">
            <div class="form-group" style="margin-bottom: 10px;">
                <label for="cart-address" style="display:block; margin-bottom: 5px; font-weight:bold;">Endereço de Entrega:</label>
                <input type="text" id="cart-address" placeholder="Rua, Número, Bairro" style="width: 100%; padding: 10px; border-radius: 5px; border: 1px solid #444; background: #222; color: #fff;">
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                 <span id="delivery-time-display" style="font-size: 0.9rem; color: #aaa;"></span>
                 <span id="delivery-fee-display" style="font-size: 0.9rem;"></span>
            </div>
        </div>
        <p id="cart-total-price" class="preco" style="text-align: right; font-size: 1.5rem; font-weight: bold; color: rgb(255, 175, 80); margin-bottom: 20px;">Total: R$ 0,00</p>
        <button id="finalize-order-btn" style="width: 100%; padding: 15px; background-color: rgb(255, 175, 80); border: none; font-weight: bold; cursor: pointer; border-radius: 5px;">Finalizar Pedido</button>
    `;
    
    cartFooter.innerHTML = deliveryHTML;

    // Referências aos novos elementos
    addressInput = document.getElementById('cart-address');
    deliveryInfoContainer = document.getElementById('delivery-info-container');
    cartTotalPriceEl = document.getElementById('cart-total-price');
    finalizeBtn = document.getElementById('finalize-order-btn');

    // Event Listeners
    openCartBtn.addEventListener('click', openCartModal);
    closeCartBtn.addEventListener('click', closeCartModal);

    window.addEventListener('click', (event) => {
        if (event.target === cartModal) closeCartModal();
    });

    cartItemsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-btn')) {
            const index = parseInt(event.target.dataset.index, 10);
            removeFromCart(index);
        }
    });

    // Recalcula totais quando o usuário digita o endereço
    addressInput.addEventListener('input', () => {
        // Recalcula baseando no total atual dos itens
        let itemsTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        calculateDeliveryTotals(itemsTotal);
    });

    // LÓGICA FINALIZAR PEDIDO
    finalizeBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Seu carrinho está vazio!');
            return;
        }

        const user = getCurrentSession();
        if (!user) {
            alert('Por favor, faça login para finalizar o pedido.');
            closeCartModal();
            document.getElementById('open-login').click();
            return;
        }

        const address = addressInput.value.trim();
        if (address.length <= 3) {
            alert('Por favor, digite um endereço válido para entrega.');
            addressInput.focus();
            return;
        }

        // Calcula valores finais
        let itemsTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const totals = calculateDeliveryTotals(itemsTotal);

        if (confirm(`Confirma o pedido?\n\nEndereço: ${address}\nDistância: ${totals.distance.toFixed(1)} km\nFrete: R$ ${totals.deliveryFee.toFixed(2)}\nTempo Estimado: ${totals.deliveryTime} min\n\nTOTAL: R$ ${totals.finalTotal.toFixed(2)}`)) {
            
            const newOrder = {
                id: Date.now(),
                userEmail: user.email,
                userName: user.name,
                userAddress: address,
                items: [...cart],
                subtotal: itemsTotal,
                deliveryFee: totals.deliveryFee,
                total: totals.finalTotal,
                estimatedTime: totals.deliveryTime,
                date: new Date().toISOString(),
                status: 'Em Preparo'
            };

            saveOrder(newOrder);

            alert(`Pedido realizado com sucesso! Acompanhe em "Meus Pedidos".`);
            
            cart = [];
            addressInput.value = ''; // Limpa endereço
            renderCart();
            closeCartModal();
        }
    });

    renderCart();
}