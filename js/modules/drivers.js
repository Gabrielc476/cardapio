// js/modules/drivers.js

// Ponto central (A Hamburgueria em Cabedelo/JP)
export const BASE_LAT = -7.093381;
export const BASE_LNG = -34.850387;

// Gerador de dados mockados
function generateMockDrivers() {
    return [
        { id: 1, nome: "Carlos Motoboy", veiculo: "Moto (Honda CG)", lat: BASE_LAT + 0.002, lng: BASE_LNG + 0.002, avaliacao: 4.8 },
        { id: 2, nome: "Ana Bike", veiculo: "Bicicleta Elétrica", lat: BASE_LAT - 0.0015, lng: BASE_LNG - 0.001, avaliacao: 5.0 },
        { id: 3, nome: "Roberto Express", veiculo: "Moto (Yamaha Fazer)", lat: BASE_LAT + 0.005, lng: BASE_LNG - 0.003, avaliacao: 4.5 },
        { id: 4, nome: "Lucas Flash", veiculo: "Moto", lat: BASE_LAT - 0.003, lng: BASE_LNG + 0.004, avaliacao: 4.7 },
        { id: 5, nome: "Mariana Entregas", veiculo: "Carro", lat: BASE_LAT + 0.001, lng: BASE_LNG - 0.006, avaliacao: 4.9 }
    ];
}

/**
 * Calcula a distância entre dois pontos (em km) usando a fórmula de Haversine.
 */
export function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Raio da terra em km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distância em km
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

/**
 * Simula uma geocodificação (Endereço -> Coordenadas).
 */
export function mockGeocodeAddress(address) {
    // Cria um hash simples da string para gerar coordenadas determinísticas
    let hash = 0;
    for (let i = 0; i < address.length; i++) {
        hash = address.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Normaliza para um pequeno deslocamento (aprox 1km a 5km de raio)
    const offsetLat = (hash % 1000) / 100000; 
    const offsetLng = ((hash * 2) % 1000) / 100000;

    return {
        lat: BASE_LAT + offsetLat,
        lng: BASE_LNG + offsetLng
    };
}

/**
 * Retorna motoristas ordenados por proximidade.
 */
export function findNearbyDrivers(targetLat, targetLng) {
    const drivers = generateMockDrivers();

    const driversWithDistance = drivers.map(driver => {
        const distance = getDistanceFromLatLonInKm(targetLat, targetLng, driver.lat, driver.lng);
        return { ...driver, distance };
    });

    return driversWithDistance.sort((a, b) => a.distance - b.distance);
}