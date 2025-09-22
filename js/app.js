// js/app.js

import { menuData } from './data/menu.js';
import { createTabs, renderCategory } from './modules/ui.js';
import { initializeModal } from './modules/modal.js';
import { initializeMap } from './modules/map.js';
import { initializeAuth } from './modules/auth.js';
import { initializeCart } from './modules/carrinho.js';

document.addEventListener('DOMContentLoaded', () => {
    // --- REFERÊNCIAS AOS ELEMENTOS PRINCIPAIS DO DOM ---
    const tabsNavigation = document.getElementById('tabs-navigation');
    const tabsContent = document.getElementById('tabs-content');

    // --- INICIALIZAÇÃO DOS MÓDULOS ---

    // 1. Inicializa a UI do menu
    createTabs(menuData, tabsNavigation);

    // 2. Inicializa o Modal de Itens e obtém a função para abri-lo
    const openModal = initializeModal();

    // 3. Inicializa o Mapa com um pequeno delay para garantir a renderização correta
    const mapCoordinates = [-7.09338141728057, -34.85038717117099];
    setTimeout(() => {
        initializeMap(mapCoordinates);
    }, 100); // Um atraso de 100 milissegundos é o suficiente

    // 4. Inicializa os modais de autenticação
    initializeAuth();

    // 5. Inicializa o carrinho
    initializeCart();

    // --- EVENT LISTENERS PRINCIPAIS ---

    // Listener para a navegação das abas
    tabsNavigation.addEventListener('click', (event) => {
        if (event.target.classList.contains('tab-button')) {
            const categoriaKey = event.target.dataset.categoria;
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            
            renderCategory(categoriaKey, menuData, tabsContent);
        }
    });

    // Listener para o clique nos cards para ABRIR o modal de item
    tabsContent.addEventListener('click', (event) => {
        const card = event.target.closest('.menu-card');
        if (card) {
            const categoriaKey = card.dataset.categoria;
            const itemId = parseInt(card.dataset.id);
            const item = menuData[categoriaKey].find(i => i.id === itemId);
            
            openModal(item, categoriaKey, menuData);
        }
    });

    // --- CARREGAMENTO INICIAL ---
    
    // Simula o clique na primeira aba para carregar o conteúdo inicial
    if (document.querySelector('.tab-button')) {
        document.querySelector('.tab-button').click();
    }
});