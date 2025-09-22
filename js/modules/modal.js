// js/modules/modal.js

let modalElement, modalTitle, modalDescription, comboOptionsDiv, refrigeranteSelect, observacoesInput, closeModalButton, modalAdicionais, totalPriceElement;

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
 * @param {Array} adicionais - O array de adicionais do item.
 */
function renderAdicionais(adicionais) {
    modalAdicionais.innerHTML = '';
    adicionaisPrice = 0; // Reseta o preço dos adicionais

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
 * @param {object} item - O objeto do item clicado.
 * @param {string} categoriaKey - A categoria do item.
 * @param {object} menuData - Os dados completos do menu.
 */
function openModal(item, categoriaKey, menuData) {
    modalTitle.textContent = item.nome;
    modalDescription.textContent = item.descricao;
    observacoesInput.value = '';
    currentItemPrice = item.preco;

    // Renderiza os adicionais
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
    
    updateTotalPrice(); // Atualiza o preço inicial
    modalElement.style.display = 'flex';
}

function closeModal() {
    modalElement.style.display = 'none';
}

/**
 * Inicializa o modal, pegando as referências do DOM e configurando os eventos.
 * @returns {function} A função openModal para ser usada externamente.
 */
export function initializeModal() {
    modalElement = document.getElementById('itemModal');
    closeModalButton = document.querySelector('.close-button');
    modalTitle = document.getElementById('modal-title');
    modalDescription = document.getElementById('modal-description');
    comboOptionsDiv = document.getElementById('combo-options');
    refrigeranteSelect = document.getElementById('refrigerante-select');
    observacoesInput = document.getElementById('observacoes-input');
    modalAdicionais = document.getElementById('modal-adicionais');
    totalPriceElement = document.getElementById('total-price');
    
    closeModalButton.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target === modalElement) {
            closeModal();
        }
    });

    return openModal;
}