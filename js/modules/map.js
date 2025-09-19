// js/modules/map.js

/**
 * Inicializa o mapa Leaflet na página.
 * @param {Array<number>} coordinates - As coordenadas [latitude, longitude].
 */
export function initializeMap(coordinates) {
    const map = L.map('map').setView(coordinates, 17);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker(coordinates).addTo(map)
        .bindPopup('<b>Hamburgrr</b><br>Estamos esperando por você!')
        .openPopup();
}