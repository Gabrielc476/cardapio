// js/app.js

import { menuData } from './data/menu.js';

document.addEventListener('DOMContentLoaded', () => {
    // --- REFERÊNCIAS AOS ELEMENTOS DO DOM ---
    const tabsNavigation = document.getElementById('tabs-navigation');
    const tabsContent = document.getElementById('tabs-content');
    const modal = document.getElementById('itemModal');
    const closeModalButton = document.querySelector('.close-button');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalPrice = document.getElementById('modal-price');
    const comboOptionsDiv = document.getElementById('combo-options');
    const refrigeranteSelect = document.getElementById('refrigerante-select');
    const observacoesInput = document.getElementById('observacoes-input');


    // --- FUNÇÕES ---
    function renderCategory(categoriaKey) {
        tabsContent.innerHTML = '';
        tabsContent.style.animation = 'none';
        
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
        
        tabsContent.appendChild(grid);
        
        void tabsContent.offsetWidth; 
        tabsContent.style.animation = 'fadeIn 0.5s ease';
    }

    function createTabs() {
        for (const categoriaKey in menuData) {
            const button = document.createElement('button');
            button.className = 'tab-button';
            button.dataset.categoria = categoriaKey;
            button.textContent = categoriaKey.charAt(0).toUpperCase() + categoriaKey.slice(1);
            tabsNavigation.appendChild(button);
        }
    }

    function openModal(item, categoriaKey) {
        modalTitle.textContent = item.nome;
        modalDescription.textContent = item.descricao;
        modalPrice.textContent = `R$ ${item.preco.toFixed(2).replace('.', ',')}`;
        observacoesInput.value = '';

        if (categoriaKey === 'combos') {
            const refrigerantes = menuData.bebidas[0].opcoes;
            refrigeranteSelect.innerHTML = '';
            refrigerantes.forEach(refri => {
                const option = document.createElement('option');
                option.value = refri;
                option.textContent = refri;
                refrigeranteSelect.appendChild(option);
            });
            comboOptionsDiv.style.display = 'block';
        } else {
            comboOptionsDiv.style.display = 'none';
        }

        modal.style.display = 'flex';
    }

    function closeModal() {
        modal.style.display = 'none';
    }

    // --- EVENT LISTENERS ---
    tabsNavigation.addEventListener('click', (event) => {
        if (event.target.classList.contains('tab-button')) {
            const categoriaKey = event.target.dataset.categoria;
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            renderCategory(categoriaKey);
        }
    });

    tabsContent.addEventListener('click', (event) => {
        const card = event.target.closest('.menu-card');
        if (card) {
            const categoriaKey = card.dataset.categoria;
            const itemId = parseInt(card.dataset.id);
            const item = menuData[categoriaKey].find(i => i.id === itemId);
            openModal(item, categoriaKey);
        }
    });

    closeModalButton.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // --- INICIALIZAÇÃO DA PÁGINA ---
    function initializePage() {
        createTabs();
        if (document.querySelector('.tab-button')) {
            document.querySelector('.tab-button').click();
        }

        const mapCoordinates = [-7.093579494764576, -34.85025308174643];
        
        const map = L.map('map').setView(mapCoordinates, 17);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        L.marker(mapCoordinates).addTo(map)
            .bindPopup('<b>Hamburgrr</b><br>Estamos esperando por você!')
            .openPopup();
    }

    initializePage();
});