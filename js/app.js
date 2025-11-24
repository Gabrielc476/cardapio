// js/app.js

// Importação de todos os módulos do sistema
import { loadMenuData } from './modules/storage.js';
import { createTabs, renderCategory } from './modules/ui.js';
import { initializeModal } from './modules/modal.js';
import { initializeMap } from './modules/map.js';
import { initializeAuth } from './modules/auth.js';
import { initializeCart } from './modules/carrinho.js';
import { initializeAdmin } from './modules/admin.js';
import { initializeOrders } from './modules/orders.js'; 
import { initializeDeliverySystem } from './modules/delivery.js';
import { initializeAI } from './modules/ai.js'; 

document.addEventListener('DOMContentLoaded', () => {
    // --- REFERÊNCIAS AOS ELEMENTOS PRINCIPAIS DO DOM ---
    const tabsNavigation = document.getElementById('tabs-navigation');
    const tabsContent = document.getElementById('tabs-content');

    // --- CARREGAMENTO DE DADOS ---
    // Carrega do LocalStorage ou do arquivo padrão na primeira vez.
    // Isso garante que alterações do Admin persistam.
    const appData = loadMenuData(); 

    // --- FUNÇÃO DE ATUALIZAÇÃO DA UI ---
    // Passada como callback para o Admin atualizar a tela após editar produtos
    function refreshUI() {
        const activeBtn = document.querySelector('.tab-button.active');
        if (activeBtn) {
            const categoria = activeBtn.dataset.categoria;
            renderCategory(categoria, appData, tabsContent);
        } else {
            // Se nenhuma aba estiver ativa, clica na primeira para iniciar
            if (document.querySelector('.tab-button')) {
                document.querySelector('.tab-button').click();
            }
        }
    }

    // --- INICIALIZAÇÃO DOS MÓDULOS ---

    // 1. Cria as abas de categorias
    createTabs(appData, tabsNavigation);

    // 2. Inicializa o Modal de Detalhes do Item
    const openModal = initializeModal();

    // 3. Inicializa o Painel de Admin (Produtos e Pedidos)
    initializeAdmin(appData, refreshUI);
    
    // 4. Inicializa o Histórico de Pedidos (Cliente)
    initializeOrders();

    // 5. Inicializa o Sistema de Entregadores (Mapa e Busca)
    initializeDeliverySystem();
    
    // 6. Inicializa o Chef IA (Gemini)
    initializeAI();

    // 7. Inicializa o Mapa do Rodapé (com delay para renderização correta)
    const mapCoordinates = [-7.09338141728057, -34.85038717117099];
    setTimeout(() => {
        initializeMap(mapCoordinates);
    }, 100);

    // 8. Inicializa Autenticação (Login/Cadastro/Logout)
    initializeAuth();

    // 9. Inicializa o Carrinho (incluindo cálculo de frete)
    initializeCart();

    // --- EVENT LISTENERS GLOBAIS ---

    // Navegação entre abas (Hambúrgueres, Bebidas, etc.)
    tabsNavigation.addEventListener('click', (event) => {
        if (event.target.classList.contains('tab-button')) {
            const categoriaKey = event.target.dataset.categoria;
            
            // Gerencia classe active
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            
            // Renderiza o conteúdo
            renderCategory(categoriaKey, appData, tabsContent);
        }
    });

    // Clique nos cards para abrir detalhes (Delegação de evento)
    tabsContent.addEventListener('click', (event) => {
        const card = event.target.closest('.menu-card');
        if (card) {
            const categoriaKey = card.dataset.categoria;
            const itemId = parseInt(card.dataset.id);
            const item = appData[categoriaKey].find(i => i.id === itemId);
            
            // Abre o modal passando os dados do item
            openModal(item, categoriaKey, appData);
        }
    });

    // Carregamento inicial da primeira categoria
    refreshUI();
});