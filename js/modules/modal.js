// js/modules/modal.js

import { addToCart } from './carrinho.js';
import { openAdminModal } from './admin.js'; // Novo import

let modalElement, modalTitle, modalDescription, comboOptionsDiv, refrigeranteSelect, observacoesInput, closeModalButton, modalAdicionais, totalPriceElement, addToCartBtn, editProductBtn;

let currentItemPrice = 0;
let adicionaisPrice = 0;

/**
 * Atualiza o preço total exibido no modal.
 */
function updateTotalPrice() {
    const total = currentItemPrice + adicionaisPrice;
    totalPriceElement.textContent = `Total: R$ ${total.toFixed(2).replace('.', ',')}`;
}

/**
 * Renderiza a lista de adicionais para um item.
 */
function renderAdicionais(adicionais) {
    modalAdicionais.innerHTML = '';
    adicionaisPrice = 0; 

    if (!adicionais || adicionais.length === 0) {
        modalAdicionais.style.display = 'none';
        return;
    }

    modalAdicionais.style.display = 'block';
    const title = document.createElement('h4');
    title.textContent = 'Adicionais';
    modalAdicionais.appendChild(title);

    adicionais.forEach(adicional => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'adicional-item';
        
        itemDiv.innerHTML = `
            <span class="adicional-nome">${adicional.nome} (+ R$ ${adicional.preco.toFixed(2).replace('.', ',')})</span>
            <div class="adicional-controls">
                <button class="control-btn minus-btn">-</button>
                <span class="adicional-qtd">0</span>
                <button class="control-btn plus-btn">+</button>
            </div>
        `;

        const plusBtn = itemDiv.querySelector('.plus-btn');
        const minusBtn = itemDiv.querySelector('.minus-btn');
        const qtdSpan = itemDiv.querySelector('.adicional-qtd');
        let quantidade = 0;

        plusBtn.addEventListener('click', () => {
            quantidade++;
            qtdSpan.textContent = quantidade;
            adicionaisPrice += adicional.preco;
            updateTotalPrice();
        });

        minusBtn.addEventListener('click', () => {
            if (quantidade > 0) {
                quantidade--;
                qtdSpan.textContent = quantidade;
                adicionaisPrice -= adicional.preco;
                updateTotalPrice();
            }
        });
        
        modalAdicionais.appendChild(itemDiv);
    });
}

/**
 * Abre e popula o modal com os dados de um item.
 */
function openModal(item, categoriaKey, menuData) {
    modalTitle.textContent = item.nome;
    modalDescription.textContent = item.descricao;
    observacoesInput.value = '';
    currentItemPrice = item.preco;

    renderAdicionais(item.adicionais);

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
    
    // Armazena o item e a categoria no botão para uso posterior (adicionar ou editar)
    addToCartBtn.currentItem = item;
    addToCartBtn.currentCategory = categoriaKey;
    
    updateTotalPrice();
    modalElement.style.display = 'flex';
}

function closeModal() {
    modalElement.style.display = 'none';
}

/**
 * Inicializa o modal, pegando as referências do DOM e configurando os eventos.
 */
export function initializeModal() {
    modalElement = document.getElementById('itemModal');
    closeModalButton = document.querySelector('#itemModal .close-button');
    modalTitle = document.getElementById('modal-title');
    modalDescription = document.getElementById('modal-description');
    comboOptionsDiv = document.getElementById('combo-options');
    refrigeranteSelect = document.getElementById('refrigerante-select');
    observacoesInput = document.getElementById('observacoes-input');
    modalAdicionais = document.getElementById('modal-adicionais');
    totalPriceElement = document.getElementById('total-price');
    
    // Botão de Adicionar ao Carrinho (o segundo botão dentro do modal-body)
    addToCartBtn = document.querySelector('#itemModal .modal-body button:last-of-type');
    
    // Botão de Editar Produto
    editProductBtn = document.getElementById('edit-product-btn');

    // Evento de Adicionar ao Carrinho
    addToCartBtn.addEventListener('click', () => {
        const item = addToCartBtn.currentItem;
        if (!item) return;

        const itemParaCarrinho = {
            id: item.id,
            name: item.nome,
            quantity: 1,
            price: currentItemPrice + adicionaisPrice
        };
        
        addToCart(itemParaCarrinho);
        closeModal();
    });

    // Evento de Editar Produto
    editProductBtn.addEventListener('click', () => {
        closeModal();
        // Abre o modal de admin em modo de edição
        openAdminModal(addToCartBtn.currentItem, addToCartBtn.currentCategory);
    });

    closeModalButton.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target === modalElement) {
            closeModal();
        }
    });

    return openModal;
}