'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { MenuItem } from '@/components/menu-item-card';

export interface CartItem extends MenuItem {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: number) => void;
  getCartTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (item: MenuItem) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id);
      if (existingItem) {
        return prevItems.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: number) => {
    setCartItems(prevItems => {
        const existingItem = prevItems.find(i => i.id === itemId);
        if (existingItem && existingItem.quantity > 1) {
            return prevItems.map(i =>
                i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
            );
        }
        return prevItems.filter(i => i.id !== itemId);
    });
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.preco * item.quantity, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    getCartTotal,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
