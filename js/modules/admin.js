// js/modules/admin.js
import { saveMenuData } from './storage.js';

let adminModal;
let productForm;
let currentDataReference; // Referência aos dados principais
let renderCallback; // Função para atualizar a tela
let adicionaisContainer; // Referência ao container dos checkboxes

export function initializeAdmin(data, updateViewCallback) {
    currentDataReference = data;
    renderCallback = updateViewCallback;
    
    adminModal = document.getElementById('adminModal');
    productForm = document.getElementById('product-form');
    adicionaisContainer = document.getElementById('adicionais-container');
    const openAdminBtn = document.getElementById('open-admin-btn');
    const closeAdminBtn = document.querySelector('#adminModal .close-button');

    openAdminBtn.addEventListener('click', () => {
        openAdminModal(); 
    });

    closeAdminBtn.addEventListener('click', () => {
        adminModal.style.display = 'none';
    });

    productForm.addEventListener('submit', (e) => {
        e.preventDefault();
        saveProductFromForm();
    });

    window.addEventListener('click', (event) => {
        if (event.target === adminModal) {
            adminModal.style.display = 'none';
        }
    });
}

/**
 * Função auxiliar para extrair todos os tipos únicos de adicionais que existem no menu.
 */
function getAllUniqueAdicionais() {
    const uniqueAds = new Map();

    // Varre todas as categorias
    Object.values(currentDataReference).forEach(items => {
        items.forEach(item => {
            if (item.adicionais && Array.isArray(item.adicionais)) {
                item.adicionais.forEach(add => {
                    // Usa o nome como chave para evitar duplicatas
                    if (!uniqueAds.has(add.nome)) {
                        uniqueAds.set(add.nome, add.preco);
                    }
                });
            }
        });
    });

    // Adiciona alguns padrões se a lista estiver vazia (primeira execução)
    if (uniqueAds.size === 0) {
        uniqueAds.set("Bacon Extra", 5.00);
        uniqueAds.set("Queijo Cheddar", 4.00);
        uniqueAds.set("Carne Extra", 8.00);
        uniqueAds.set("Molho Especial", 3.00);
    }

    return uniqueAds; // Retorna um Map(Nome -> Preço)
}

export function openAdminModal(item = null, category = 'hamburgueres') {
    const title = document.getElementById('admin-modal-title');
    const idInput = document.getElementById('prod-id');
    const nameInput = document.getElementById('prod-name');
    const descInput = document.getElementById('prod-desc');
    const priceInput = document.getElementById('prod-price');
    const catSelect = document.getElementById('prod-category');
    const imgInput = document.getElementById('prod-img');

    // 1. Popula Categorias
    catSelect.innerHTML = '';
    Object.keys(currentDataReference).forEach(key => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = key.charAt(0).toUpperCase() + key.slice(1);
        catSelect.appendChild(option);
    });

    // 2. Gera os Checkboxes de Adicionais
    adicionaisContainer.innerHTML = '';
    const allAdicionais = getAllUniqueAdicionais();
    
    // Conjunto de nomes de adicionais que este item JÁ possui (para marcar os checkboxes)
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
        checkbox.dataset.price = price; // Guardamos o preço no dataset
        
        // Se estiver editando e o item tiver esse adicional, marca como checked
        if (existingAdicionaisNames.has(name)) {
            checkbox.checked = true;
        }

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(`${name} (R$ ${price.toFixed(2)})`));
        
        adicionaisContainer.appendChild(label);
    });


    // 3. Preenche o formulário
    if (item) {
        // MODO EDIÇÃO
        title.textContent = 'Editar Produto';
        idInput.value = item.id;
        nameInput.value = item.nome;
        descInput.value = item.descricao;
        priceInput.value = item.preco;
        imgInput.value = item.imagem;
        catSelect.value = category;
        catSelect.disabled = true; 
    } else {
        // MODO CADASTRO
        title.textContent = 'Novo Produto';
        productForm.reset();
        idInput.value = '';
        catSelect.value = category;
        catSelect.disabled = false;
        // Limpa checkboxes
        adicionaisContainer.querySelectorAll('input').forEach(cb => cb.checked = false);
    }

    adminModal.style.display = 'flex';
}

function saveProductFromForm() {
    const id = document.getElementById('prod-id').value;
    const category = document.getElementById('prod-category').value;
    
    // Captura os adicionais selecionados
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
        adicionais: selectedAdicionais, // Salva a lista selecionada
        ingredientes: {}
    };

    if (id) {
        // EDITAR
        const index = currentDataReference[category].findIndex(p => p.id == id);
        if (index !== -1) {
            // Preserva ingredientes antigos se existirem, mas sobrescreve adicionais
            newProduct.ingredientes = currentDataReference[category][index].ingredientes || {};
            currentDataReference[category][index] = newProduct;
        }
    } else {
        // NOVO
        if (!currentDataReference[category]) {
            currentDataReference[category] = [];
        }
        currentDataReference[category].push(newProduct);
    }

    saveMenuData(currentDataReference);
    alert('Produto salvo com sucesso!');
    adminModal.style.display = 'none';
    
    renderCallback(); 
}