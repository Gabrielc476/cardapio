// js/modules/storage.js
import { menuData as defaultData } from '../data/menu.js';

const STORAGE_KEY = 'hamburgueria_menu_data_v1';
const USERS_KEY = 'hamburgueria_users_v1';
const SESSION_KEY = 'hamburgueria_session_v1';
const ORDERS_KEY = 'hamburgueria_orders_v1';

// --- MENU DATA ---
export function loadMenuData() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        saveMenuData(defaultData);
        return JSON.parse(JSON.stringify(defaultData));
    }
    return JSON.parse(stored);
}

export function saveMenuData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// --- USUÁRIOS ---
export function getUsers() {
    const stored = localStorage.getItem(USERS_KEY);
    if (!stored) {
        // Cria usuário ADMIN padrão se não existir
        const adminUser = [{
            name: "Administrador",
            email: "admin@admin.com",
            password: "1234",
            role: "admin"
        }];
        localStorage.setItem(USERS_KEY, JSON.stringify(adminUser));
        return adminUser;
    }
    return JSON.parse(stored);
}

export function saveUser(user) {
    const users = getUsers();
    user.role = 'user'; 
    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getCurrentSession() {
    const stored = localStorage.getItem(SESSION_KEY);
    return stored ? JSON.parse(stored) : null;
}

export function loginUserSession(user) {
    const safeUser = { ...user };
    delete safeUser.password; 
    localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
}

export function logoutUserSession() {
    localStorage.removeItem(SESSION_KEY);
}

// --- PEDIDOS ---

export function getAllOrders() {
    const stored = localStorage.getItem(ORDERS_KEY);
    // Retorna array vazio se null, e ordena por data (mais recente primeiro)
    const orders = stored ? JSON.parse(stored) : [];
    return orders.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getUserOrders(userEmail) {
    const orders = getAllOrders();
    return orders.filter(order => order.userEmail === userEmail);
}

export function saveOrder(order) {
    const orders = getAllOrders();
    orders.push(order);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

/**
 * Atualiza o status de um pedido específico
 */
export function updateOrderStatus(orderId, newStatus) {
    const orders = getAllOrders();
    const index = orders.findIndex(o => o.id === orderId);
    
    if (index !== -1) {
        orders[index].status = newStatus;
        localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
        return true;
    }
    return false;
}