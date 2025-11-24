// js/modules/ai.js
import { loadMenuData } from './storage.js';
import { addToCart } from './carrinho.js';

// --- CONFIGURAÇÃO ---
const API_KEY = "AIzaSyA5T8ICtIwztUhpXKzIHWNiPDtfnSc1uew"; // <--- INSIRA SUA API KEY DO GOOGLE GEMINI AQUI
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`;

let aiModal, aiInput, aiSendBtn, aiResultContainer, aiLoading;
let allMenuItems = [];

export function initializeAI() {
    aiModal = document.getElementById('aiModal');
    const openAiBtn = document.getElementById('open-ai-btn');
    const closeAiBtn = document.querySelector('#aiModal .close-button');
    
    aiInput = document.getElementById('ai-input');
    aiSendBtn = document.getElementById('ai-send-btn');
    aiResultContainer = document.getElementById('ai-result');
    aiLoading = document.getElementById('ai-loading');

    // Prepara os dados do menu para a IA (Flattening)
    const menuData = loadMenuData();
    Object.keys(menuData).forEach(category => {
        menuData[category].forEach(item => {
            allMenuItems.push({ ...item, category });
        });
    });

    if (openAiBtn) {
        openAiBtn.addEventListener('click', () => {
            aiModal.style.display = 'flex';
            aiInput.focus();
        });
    }

    if (closeAiBtn) closeAiBtn.addEventListener('click', () => aiModal.style.display = 'none');
    
    window.addEventListener('click', (e) => {
        if (e.target === aiModal) aiModal.style.display = 'none';
    });

    aiSendBtn.addEventListener('click', handleUserRequest);
    aiInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleUserRequest();
    });
}

async function handleUserRequest() {
    const userText = aiInput.value.trim();
    if (!userText) return;
    if (API_KEY === "") {
        alert("API Key do Gemini não configurada no arquivo js/modules/ai.js");
        return;
    }

    // UI Updates
    aiResultContainer.innerHTML = '';
    aiLoading.style.display = 'block';
    aiSendBtn.disabled = true;

    try {
        const recommendation = await fetchGeminiRecommendation(userText);
        renderRecommendation(recommendation);
    } catch (error) {
        console.error(error);
        aiResultContainer.innerHTML = `<p style="color: #ff4757;">Desculpe, o Chef IA teve um problema técnico: ${error.message}</p>`;
    } finally {
        aiLoading.style.display = 'none';
        aiSendBtn.disabled = false;
        aiInput.value = '';
    }
}

async function fetchGeminiRecommendation(userQuery) {
    // 1. Prepara o menu simplificado para economizar tokens
    const menuContext = allMenuItems.map(item => 
        `ID: ${item.id}, Nome: ${item.nome}, Desc: ${item.descricao}, Preço: ${item.preco}, Ingredientes: ${JSON.stringify(item.ingredientes || [])}`
    ).join('\n');

    // 2. Define a Ferramenta (Function Declaration)
    const tools = [{
        function_declarations: [{
            name: "recommend_item",
            description: "Recomenda um item do cardápio baseado no gosto do cliente.",
            parameters: {
                type: "OBJECT",
                properties: {
                    itemId: { type: "NUMBER", description: "O ID numérico do item escolhido do menu." },
                    reason: { type: "STRING", description: "Uma explicação curta e divertida do porquê esse item combina com o pedido (em Português)." }
                },
                required: ["itemId", "reason"]
            }
        }]
    }];

    // 3. Monta o Payload
    const payload = {
        contents: [{
            parts: [{
                text: `Você é um garçom experiente e carismático da 'Hamburgueria Artesano'. 
                Abaixo está o nosso cardápio completo:\n${menuContext}\n\n
                O cliente disse: "${userQuery}".
                Analise o pedido e chame a função 'recommend_item' com a melhor opção.`
            }]
        }],
        tools: tools,
        tool_config: { function_calling_config: { mode: "ANY" } } // Força o uso da função
    };

    // 4. Chamada API
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    const data = await response.json();

    // 5. Extração da Chamada de Função
    const candidate = data.candidates?.[0];
    const functionCall = candidate?.content?.parts?.find(p => p.functionCall)?.functionCall;

    if (functionCall && functionCall.name === 'recommend_item') {
        return functionCall.args; // Retorna { itemId, reason }
    } else {
        throw new Error("A IA não conseguiu escolher um item específico.");
    }
}

function renderRecommendation({ itemId, reason }) {
    // Encontra o item real nos dados
    const item = allMenuItems.find(i => i.id === itemId);

    if (!item) {
        aiResultContainer.innerHTML = '<p>Item recomendado não encontrado no catálogo.</p>';
        return;
    }

    // Renderiza o Card
    const card = document.createElement('div');
    card.className = 'ai-recommendation-card';
    card.innerHTML = `
        <div class="ai-reason">
            <span class="ai-avatar">🤖 Chef IA:</span>
            <p>"${reason}"</p>
        </div>
        <div class="menu-card" style="border-color: var(--cor-primaria); box-shadow: 0 0 15px rgba(255, 175, 80, 0.3);">
            <img src="${item.imagem}" alt="${item.nome}">
            <div class="card-content">
                <h3>${item.nome}</h3>
                <p class="descricao">${item.descricao}</p>
                <p class="preco">R$ ${item.preco.toFixed(2).replace('.', ',')}</p>
                <button class="ai-add-btn">Adicionar ao Carrinho</button>
            </div>
        </div>
    `;

    // Botão de adicionar direto
    const btn = card.querySelector('.ai-add-btn');
    btn.addEventListener('click', () => {
        addToCart({
            id: item.id,
            name: item.nome,
            quantity: 1,
            price: item.preco
        });
        aiModal.style.display = 'none';
        alert('Adicionado ao carrinho!');
    });

    aiResultContainer.appendChild(card);
}