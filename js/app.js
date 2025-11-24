// js/app.js

import { loadMenuData } from './modules/storage.js';
import { createTabs, renderCategory } from './modules/ui.js';
import { initializeModal } from './modules/modal.js';
import { initializeMap } from './modules/map.js';
import { initializeAuth } from './modules/auth.js';
import { initializeCart } from './modules/carrinho.js';
import { initializeAdmin } from './modules/admin.js';
import { initializeOrders } from './modules/orders.js'; 
import { initializeDeliverySystem } from './modules/delivery.js'; // Novo Import

document.addEventListener('DOMContentLoaded', () => {
    // --- REFERÊNCIAS AOS ELEMENTOS PRINCIPAIS DO DOM ---
    const tabsNavigation = document.getElementById('tabs-navigation');
    const tabsContent = document.getElementById('tabs-content');

    // --- CARREGAMENTO DE DADOS ---
    // Carrega do LocalStorage ou do arquivo padrão na primeira vez
    const appData = loadMenuData(); 

    // Função para atualizar a tela após edições no admin
    function refreshUI() {
        const activeBtn = document.querySelector('.tab-button.active');
        if (activeBtn) {
            const categoria = activeBtn.dataset.categoria;
            renderCategory(categoria, appData, tabsContent);
        } else {
            // Se nenhuma aba estiver ativa, clica na primeira
            if (document.querySelector('.tab-button')) {
                document.querySelector('.tab-button').click();
            }
        }
    }

    // --- INICIALIZAÇÃO DOS MÓDULOS ---

    // 1. Inicializa a UI do menu (Abas)
    createTabs(appData, tabsNavigation);

    // 2. Inicializa o Modal de Itens e obtém a função para abri-lo
    const openModal = initializeModal();

    // 3. Inicializa o Módulo Admin
    initializeAdmin(appData, refreshUI);
    
    // 4. Inicializa o Módulo de Pedidos
    initializeOrders();

    // 5. Inicializa o Módulo de Entregadores (NOVO)
    initializeDeliverySystem();

    // 6. Inicializa o Mapa com um pequeno delay
    const mapCoordinates = [-7.09338141728057, -34.85038717117099];
    setTimeout(() => {
        initializeMap(mapCoordinates);
    }, 100);

    // 7. Inicializa os modais de autenticação
    initializeAuth();

    // 8. Inicializa o carrinho
    initializeCart();

    // --- EVENT LISTENERS PRINCIPAIS ---

    // Listener para a navegação das abas
    tabsNavigation.addEventListener('click', (event) => {
        if (event.target.classList.contains('tab-button')) {
            const categoriaKey = event.target.dataset.categoria;
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            
            renderCategory(categoriaKey, appData, tabsContent);
        }
    });

    // Listener para o clique nos cards para ABRIR o modal de item
    tabsContent.addEventListener('click', (event) => {
        const card = event.target.closest('.menu-card');
        if (card) {
            const categoriaKey = card.dataset.categoria;
            const itemId = parseInt(card.dataset.id);
            const item = appData[categoriaKey].find(i => i.id === itemId);
            
            // Passamos item, categoria e os dados completos
            openModal(item, categoriaKey, appData);
        }
    });

    // --- CARREGAMENTO INICIAL ---
    refreshUI();
});