// js/modules/delivery.js
import { mockGeocodeAddress, findNearbyDrivers } from './drivers.js';

let deliveryModal;
let deliveryMap; // Instância do Leaflet específica para este modal
let userMarker;
let driverMarkers = [];

export function initializeDeliverySystem() {
    deliveryModal = document.getElementById('deliveryModal');
    const openBtn = document.getElementById('open-delivery-btn');
    const closeBtn = document.querySelector('#deliveryModal .close-button');
    const searchBtn = document.getElementById('search-delivery-btn');
    const addressInput = document.getElementById('delivery-address');

    if (openBtn) {
        openBtn.addEventListener('click', () => {
            deliveryModal.style.display = 'flex';
            // Precisamos inicializar/redimensionar o mapa após o modal estar visível
            setTimeout(initDeliveryMap, 100);
        });
    }

    closeBtn.addEventListener('click', () => {
        deliveryModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === deliveryModal) {
            deliveryModal.style.display = 'none';
        }
    });

    searchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const address = addressInput.value;
        if (address.trim() === "") {
            alert("Por favor, digite um endereço.");
            return;
        }
        performSearch(address);
    });
}

function initDeliveryMap() {
    // Se o mapa já existe, apenas ajusta o tamanho (fix para modal oculto)
    if (deliveryMap) {
        deliveryMap.invalidateSize();
        return;
    }

    // Coordenadas iniciais (Centro da cidade mockado)
    const startCoords = [-7.093381, -34.850387];

    deliveryMap = L.map('delivery-map').setView(startCoords, 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(deliveryMap);
}

function performSearch(address) {
    // 1. Obter coordenadas simuladas
    const coords = mockGeocodeAddress(address);

    // 2. Encontrar motoristas
    const nearbyDrivers = findNearbyDrivers(coords.lat, coords.lng);

    // 3. Atualizar Mapa
    updateMapVisuals(coords, nearbyDrivers);

    // 4. Atualizar Lista
    renderDriverList(nearbyDrivers);
}

function updateMapVisuals(userCoords, drivers) {
    // Limpa marcadores antigos
    if (userMarker) deliveryMap.removeLayer(userMarker);
    driverMarkers.forEach(m => deliveryMap.removeLayer(m));
    driverMarkers = [];

    // Adiciona marcador do Usuário (Casa) - Ícone Azul/Padrão
    userMarker = L.marker([userCoords.lat, userCoords.lng])
        .addTo(deliveryMap)
        .bindPopup("<b>Seu Endereço</b><br>Simulado aqui")
        .openPopup();

    // Adiciona marcadores dos Motoristas - Círculos ou Ícones diferentes
    drivers.forEach(driver => {
        const marker = L.circleMarker([driver.lat, driver.lng], {
            color: '#ffaf50',
            fillColor: '#ffaf50',
            fillOpacity: 0.8,
            radius: 8
        }).addTo(deliveryMap);
        
        marker.bindPopup(`<b>${driver.nome}</b><br>${driver.veiculo}<br>⭐ ${driver.avaliacao}`);
        driverMarkers.push(marker);
    });

    // Centraliza o mapa no usuário
    deliveryMap.setView([userCoords.lat, userCoords.lng], 15);
}

function renderDriverList(drivers) {
    const listContainer = document.getElementById('drivers-list');
    listContainer.innerHTML = '';

    if (drivers.length === 0) {
        listContainer.innerHTML = '<p>Nenhum entregador encontrado na região.</p>';
        return;
    }

    drivers.forEach(driver => {
        const item = document.createElement('div');
        item.className = 'driver-card';
        item.innerHTML = `
            <div class="driver-info">
                <span class="driver-name">${driver.nome}</span>
                <span class="driver-vehicle">${driver.veiculo}</span>
            </div>
            <div class="driver-stats">
                <span class="driver-dist">${driver.distance.toFixed(1)} km</span>
                <span class="driver-rating">⭐ ${driver.avaliacao}</span>
            </div>
        `;
        listContainer.appendChild(item);
    });
}