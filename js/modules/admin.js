// js/modules/admin.js
import { saveMenuData, getAllOrders, updateOrderStatus } from './storage.js';

let adminModal, adminOrdersModal; // Modais
let productForm, adminOrdersList; // Elementos internos
let currentDataReference;
let renderCallback;
let adicionaisContainer;

export function initializeAdmin(data, updateViewCallback) {
    currentDataReference = data;
    renderCallback = updateViewCallback;
    
    // --- Referências DOM ---
    adminModal = document.getElementById('adminModal'); // Modal Produto
    adminOrdersModal = document.getElementById('adminOrdersModal'); // Modal Pedidos (Novo)
    productForm = document.getElementById('product-form');
    adicionaisContainer = document.getElementById('adicionais-container');
    adminOrdersList = document.getElementById('admin-orders-list');

    // Botões Header
    const openAdminBtn = document.getElementById('open-admin-btn');
    const openAdminOrdersBtn = document.getElementById('open-admin-orders-btn');
    
    // Botões Fechar
    const closeAdminBtn = document.querySelector('#adminModal .close-button');
    const closeAdminOrdersBtn = document.querySelector('#adminOrdersModal .close-button');

    // --- Eventos Modal Produto ---
    if(openAdminBtn) openAdminBtn.addEventListener('click', () => openAdminModal());
    if(closeAdminBtn) closeAdminBtn.addEventListener('click', () => adminModal.style.display = 'none');
    
    productForm.addEventListener('submit', (e) => {
        e.preventDefault();
        saveProductFromForm();
    });

    // --- Eventos Modal Pedidos (NOVO) ---
    if (openAdminOrdersBtn) {
        openAdminOrdersBtn.addEventListener('click', () => {
            renderAdminOrders();
            adminOrdersModal.style.display = 'flex';
        });
    }

    if (closeAdminOrdersBtn) {
        closeAdminOrdersBtn.addEventListener('click', () => adminOrdersModal.style.display = 'none');
    }

    // Fechar ao clicar fora
    window.addEventListener('click', (event) => {
        if (event.target === adminModal) adminModal.style.display = 'none';
        if (event.target === adminOrdersModal) adminOrdersModal.style.display = 'none';
    });
}

// --- LÓGICA DE PEDIDOS (NOVO) ---

function renderAdminOrders() {
    const orders = getAllOrders();
    adminOrdersList.innerHTML = '';

    if (orders.length === 0) {
        adminOrdersList.innerHTML = '<p style="text-align:center; color:#888;">Nenhum pedido realizado ainda.</p>';
        return;
    }

    orders.forEach(order => {
        const orderCard = document.createElement('div');
        orderCard.className = 'admin-order-card';

        // Formata data
        const dateObj = new Date(order.date);
        const dateString = dateObj.toLocaleDateString('pt-BR') + ' ' + dateObj.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});

        // Itens
        const itemsSummary = order.items.map(i => `${i.quantity}x ${i.name}`).join(', ');

        orderCard.innerHTML = `
            <div class="admin-order-header">
                <span class="order-id">#${order.id.toString().slice(-6)}</span>
                <span class="order-date">${dateString}</span>
            </div>
            <div class="admin-order-info">
                <p><strong>Cliente:</strong> ${order.userName} (${order.userEmail})</p>
                <p><strong>Endereço:</strong> ${order.userAddress || 'Retirada'}</p>
                <p><strong>Itens:</strong> <span style="color:#ccc;">${itemsSummary}</span></p>
                <p><strong>Total:</strong> <span style="color:#ffaf50;">R$ ${order.total.toFixed(2).replace('.', ',')}</span></p>
            </div>
            <div class="admin-order-actions">
                <label>Status:</label>
                <select class="status-select" data-id="${order.id}">
                    <option value="Recebido" ${order.status === 'Recebido' ? 'selected' : ''}>Recebido</option>
                    <option value="Em Preparo" ${order.status === 'Em Preparo' ? 'selected' : ''}>Em Preparo</option>
                    <option value="Saiu para Entrega" ${order.status === 'Saiu para Entrega' ? 'selected' : ''}>Saiu para Entrega</option>
                    <option value="Entregue" ${order.status === 'Entregue' ? 'selected' : ''}>Entregue</option>
                    <option value="Cancelado" ${order.status === 'Cancelado' ? 'selected' : ''}>Cancelado</option>
                </select>
            </div>
        `;

        adminOrdersList.appendChild(orderCard);
    });

    // Adiciona Listeners para mudança de status
    const selects = adminOrdersList.querySelectorAll('.status-select');
    selects.forEach(select => {
        select.addEventListener('change', (e) => {
            const newStatus = e.target.value;
            const orderId = parseInt(e.target.dataset.id);
            
            updateOrderStatus(orderId, newStatus);
            
            // Feedback visual rápido (opcional, pode ser um toast)
            e.target.style.borderColor = '#4cd137'; // Verde temporário
            setTimeout(() => e.target.style.borderColor = '#3a3a3a', 1000);
        });
    });
}


// --- LÓGICA DE PRODUTOS (EXISTENTE) ---

function getAllUniqueAdicionais() {
    const uniqueAds = new Map();
    Object.values(currentDataReference).forEach(items => {
        items.forEach(item => {
            if (item.adicionais && Array.isArray(item.adicionais)) {
                item.adicionais.forEach(add => {
                    if (!uniqueAds.has(add.nome)) {
                        uniqueAds.set(add.nome, add.preco);
                    }
                });
            }
        });
    });
    if (uniqueAds.size === 0) {
        uniqueAds.set("Bacon Extra", 5.00);
        uniqueAds.set("Queijo Cheddar", 4.00);
        uniqueAds.set("Carne Extra", 8.00);
    }
    return uniqueAds; 
}

export function openAdminModal(item = null, category = 'hamburgueres') {
    const title = document.getElementById('admin-modal-title');
    const idInput = document.getElementById('prod-id');
    const nameInput = document.getElementById('prod-name');
    const descInput = document.getElementById('prod-desc');
    const priceInput = document.getElementById('prod-price');
    const catSelect = document.getElementById('prod-category');
    const imgInput = document.getElementById('prod-img');

    catSelect.innerHTML = '';
    Object.keys(currentDataReference).forEach(key => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = key.charAt(0).toUpperCase() + key.slice(1);
        catSelect.appendChild(option);
    });

    adicionaisContainer.innerHTML = '';
    const allAdicionais = getAllUniqueAdicionais();
    const existingAdicionaisNames = new Set();
    if (item && item.adicionais) {
        item.adicionais.forEach(a => existingAdicionaisNames.add(a.nome));
    }

    allAdicionais.forEach((price, name) => {
        const label = document.createElement('label');
        label.className = 'adicional-option';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = name;
        checkbox.dataset.price = price;
        if (existingAdicionaisNames.has(name)) checkbox.checked = true;
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(`${name} (R$ ${price.toFixed(2)})`));
        adicionaisContainer.appendChild(label);
    });

    if (item) {
        title.textContent = 'Editar Produto';
        idInput.value = item.id;
        nameInput.value = item.nome;
        descInput.value = item.descricao;
        priceInput.value = item.preco;
        imgInput.value = item.imagem;
        catSelect.value = category;
        catSelect.disabled = true; 
    } else {
        title.textContent = 'Novo Produto';
        productForm.reset();
        idInput.value = '';
        catSelect.value = category;
        catSelect.disabled = false;
        adicionaisContainer.querySelectorAll('input').forEach(cb => cb.checked = false);
    }

    adminModal.style.display = 'flex';
}

function saveProductFromForm() {
    const id = document.getElementById('prod-id').value;
    const category = document.getElementById('prod-category').value;
    
    const selectedAdicionais = [];
    const checkboxes = adicionaisContainer.querySelectorAll('input[type="checkbox"]:checked');
    checkboxes.forEach(cb => {
        selectedAdicionais.push({
            nome: cb.value,
            preco: parseFloat(cb.dataset.price)
        });
    });

    const newProduct = {
        id: id ? parseInt(id) : Date.now(),
        nome: document.getElementById('prod-name').value,
        descricao: document.getElementById('prod-desc').value,
        preco: parseFloat(document.getElementById('prod-price').value),
        imagem: document.getElementById('prod-img').value || 'img/logo.png',
        adicionais: selectedAdicionais,
        ingredientes: {}
    };

    if (id) {
        const index = currentDataReference[category].findIndex(p => p.id == id);
        if (index !== -1) {
            newProduct.ingredientes = currentDataReference[category][index].ingredientes || {};
            currentDataReference[category][index] = newProduct;
        }
    } else {
        if (!currentDataReference[category]) currentDataReference[category] = [];
        currentDataReference[category].push(newProduct);
    }

    saveMenuData(currentDataReference);
    alert('Produto salvo com sucesso!');
    adminModal.style.display = 'none';
    renderCallback(); 
}