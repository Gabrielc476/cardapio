// js/modules/orders.js
import { getUserOrders, getCurrentSession } from './storage.js';

let ordersModal;
let ordersContainer;

export function initializeOrders() {
    ordersModal = document.getElementById('ordersModal');
    ordersContainer = document.getElementById('orders-list');
    const openOrdersBtn = document.getElementById('open-orders-btn');
    const closeBtn = document.querySelector('#ordersModal .close-button');

    // Abre o modal
    if (openOrdersBtn) {
        openOrdersBtn.addEventListener('click', () => {
            renderOrders();
            ordersModal.style.display = 'flex';
        });
    }

    // Fecha o modal
    closeBtn.addEventListener('click', () => {
        ordersModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === ordersModal) {
            ordersModal.style.display = 'none';
        }
    });
}

function renderOrders() {
    const user = getCurrentSession();
    if (!user) return;

    const orders = getUserOrders(user.email);
    ordersContainer.innerHTML = '';

    if (orders.length === 0) {
        ordersContainer.innerHTML = '<p style="text-align:center; color: #888;">Você ainda não fez nenhum pedido.</p>';
        return;
    }

    orders.forEach(order => {
        const orderCard = document.createElement('div');
        orderCard.className = 'order-card';
        
        // Formata data
        const dateObj = new Date(order.date);
        const dateString = dateObj.toLocaleDateString('pt-BR') + ' às ' + dateObj.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});

        // Monta lista de itens em string
        const itemsListHTML = order.items.map(item => 
            `<li>${item.quantity}x ${item.name}</li>`
        ).join('');

        orderCard.innerHTML = `
            <div class="order-header">
                <span class="order-date">${dateString}</span>
                <span class="order-total">R$ ${order.total.toFixed(2).replace('.', ',')}</span>
            </div>
            <div class="order-status">Status: <strong>${order.status}</strong></div>
            <ul class="order-items">
                ${itemsListHTML}
            </ul>
        `;

        ordersContainer.appendChild(orderCard);
    });
}