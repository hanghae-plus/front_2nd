import { useState } from 'react';

import type { CartItem, Coupon, Product } from '../../types';
import {
  calculateCartTotal,
  updateCartItemQuantity,
} from './utils/cartUtils.ts';

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const addToCart = (product: Product) => {
    const existingItem = cart.find(
      (cartItem) => cartItem.product.id === product.id,
    );
    if (existingItem) {
      const updatedCart = updateCartItemQuantity({
        cart,
        productId: product.id,
        newQuantity: existingItem.quantity + 1,
      });
      setCart(updatedCart);
      return;
    }
    setCart((prevCart) => [...prevCart, { product, quantity: 1 }]);
  };

  const removeFromCart = (productId: string) => {
    const updatedCart = updateCartItemQuantity({
      cart,
      productId,
      newQuantity: 0,
    });
    setCart(updatedCart);
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    const updatedCart = updateCartItemQuantity({
      cart,
      productId,
      newQuantity,
    });
    setCart(updatedCart);
  };

  const applyCoupon = (coupon: Coupon) => setSelectedCoupon(coupon);

  const calculateTotal = () => calculateCartTotal({ cart, selectedCoupon });
  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateTotal,
    selectedCoupon,
  };
};
