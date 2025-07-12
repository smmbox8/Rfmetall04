import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PriceItem } from '../data/priceData';

export interface CartItem {
  id: string;
  item: PriceItem;
  quantityTons: number;
  quantityPieces: number;
  quantityMeters: number;
  pricePerTon: number;
  totalPrice: number;
  addedAt: Date;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: PriceItem, quantityTons: number, quantityPieces: number, quantityMeters: number, pricePerTon: number, totalPrice: number) => void;
  removeFromCart: (id: string) => void;
  updateCartItem: (id: string, quantityTons: number, quantityPieces: number, quantityMeters: number, totalPrice: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isInCart: (itemId: number) => CartItem | null;
  getItemQuantityInCart: (itemId: number) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Загружаем корзину из localStorage при инициализации
  useEffect(() => {
    const savedCart = localStorage.getItem('atlantmetal_cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart.map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt)
        })));
      } catch (error) {
        console.error('Ошибка загрузки корзины:', error);
      }
    }
  }, []);

  // Сохраняем корзину в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('atlantmetal_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (
    item: PriceItem, 
    quantityTons: number, 
    quantityPieces: number, 
    quantityMeters: number, 
    pricePerTon: number, 
    totalPrice: number
  ) => {
    const existingItem = items.find(cartItem => cartItem.item.id === item.id);
    
    if (existingItem) {
      // Обновляем существующий товар
      setItems(items.map(cartItem => 
        cartItem.item.id === item.id 
          ? {
              ...cartItem,
              quantityTons: cartItem.quantityTons + quantityTons,
              quantityPieces: cartItem.quantityPieces + quantityPieces,
              quantityMeters: cartItem.quantityMeters + quantityMeters,
              totalPrice: cartItem.totalPrice + totalPrice
            }
          : cartItem
      ));
    } else {
      // Добавляем новый товар
      const newCartItem: CartItem = {
        id: `${item.id}_${Date.now()}`,
        item,
        quantityTons,
        quantityPieces,
        quantityMeters,
        pricePerTon,
        totalPrice,
        addedAt: new Date()
      };
      setItems([...items, newCartItem]);
    }
  };

  const removeFromCart = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateCartItem = (
    id: string, 
    quantityTons: number, 
    quantityPieces: number, 
    quantityMeters: number, 
    totalPrice: number
  ) => {
    setItems(items.map(item => 
      item.id === id 
        ? { ...item, quantityTons, quantityPieces, quantityMeters, totalPrice }
        : item
    ));
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.length;
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.totalPrice, 0);
  };

  const isInCart = (itemId: number): CartItem | null => {
    return items.find(cartItem => cartItem.item.id === itemId) || null;
  };

  const getItemQuantityInCart = (itemId: number): number => {
    const cartItem = items.find(item => item.item.id === itemId);
    return cartItem ? cartItem.quantityPieces : 0;
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateCartItem,
      clearCart,
      getTotalItems,
      getTotalPrice,
      isInCart,
      getItemQuantityInCart
    }}>
      {children}
    </CartContext.Provider>
  );
};