import { useState } from 'react';
import { CartItem, Product } from '../../types';
import useLocalStorage from './useLocalStorage';

const useCart = () => {
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>('cartItems', []);
  
  const addToCart = (product: Product, quantity: number = 1) => {
    if (quantity <= 0) return; //
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        return [...prevItems, { product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 0) return; //
    setCartItems(prevItems => 
      prevItems.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };
};

export default useCart;
