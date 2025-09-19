// js/modules/modal.js

// Mantém as referências aos elementos do modal dentro do módulo.
let modalElement, modalTitle, modalDescription, modalPrice, comboOptionsDiv, refrigeranteSelect, observacoesInput, closeModalButton;

/**
 * Abre e popula o modal com os dados de um item.
 * @param {object} item - O objeto do item clicado.
 * @param {string} categoriaKey - A categoria do item.
 * @param {object} menuData - Os dados completos do menu (necessário para os combos).
 */
function openModal(item, categoriaKey, menuData) {
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

    modalElement.style.display = 'flex';
}

function closeModal() {
    modalElement.style.display = 'none';
}

/**
 * Inicializa o modal, pegando as referências do DOM e configurando os eventos de fechar.
 * @returns {function} A função openModal para ser usada externamente.
 */
export function initializeModal() {
    modalElement = document.getElementById('itemModal');
    closeModalButton = document.querySelector('.close-button');
    modalTitle = document.getElementById('modal-title');
    modalDescription = document.getElementById('modal-description');
    modalPrice = document.getElementById('modal-price');
    comboOptionsDiv = document.getElementById('combo-options');
    refrigeranteSelect = document.getElementById('refrigerante-select');
    observacoesInput = document.getElementById('observacoes-input');
    
    closeModalButton.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target === modalElement) {
            closeModal();
        }
    });

    // Retorna a função de abrir para que o app.js possa chamá-la.
    return openModal;
}