// js/modules/ui.js

/**
 * Cria os botões de navegação das abas.
 * @param {object} menuData - Os dados completos do menu.
 * @param {HTMLElement} tabsNavigationElement - O elemento <nav> onde as abas serão inseridas.
 */
export function createTabs(menuData, tabsNavigationElement) {
    for (const categoriaKey in menuData) {
        const button = document.createElement('button');
        button.className = 'tab-button';
        button.dataset.categoria = categoriaKey;
        button.textContent = categoriaKey.charAt(0).toUpperCase() + categoriaKey.slice(1);
        tabsNavigationElement.appendChild(button);
    }
}

/**
 * Renderiza os cards de uma categoria específica.
 * @param {string} categoriaKey - A chave da categoria a ser renderizada.
 * @param {object} menuData - Os dados completos do menu.
 * @param {HTMLElement} tabsContentElement - O elemento <div> onde os cards serão inseridos.
 */
export function renderCategory(categoriaKey, menuData, tabsContentElement) {
    tabsContentElement.innerHTML = '';
    tabsContentElement.style.animation = 'none';

    const itemsArray = menuData[categoriaKey];
    const grid = document.createElement('div');
    grid.className = 'menu-grid';

    itemsArray.forEach(item => {
        const card = document.createElement('div');
        card.className = 'menu-card';
        card.dataset.categoria = categoriaKey;
        card.dataset.id = item.id;
        card.innerHTML = `
            <img src="${item.imagem}" alt="${item.nome}">
            <div class="card-content">
                <h3>${item.nome}</h3>
                <p class="descricao">${item.descricao}</p>
                <p class="preco">R$ ${item.preco.toFixed(2).replace('.', ',')}</p>
            </div>
        `;
        grid.appendChild(card);
    });

    tabsContentElement.appendChild(grid);
    void tabsContentElement.offsetWidth;
    tabsContentElement.style.animation = 'fadeIn 0.5s ease';
}