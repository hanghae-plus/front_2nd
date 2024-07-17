// useCart.ts
import { useState } from 'react';

import { CartItem, Coupon, Product } from '../../types';
import { calculateCartTotal, updateCartItemQuantity } from './utils/cartUtils';

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const addToCart = (product: Product) => {
    const cartItem = cart.find((item) => item.product.id === product.id);
    const remainingStock = product.stock - (cartItem?.quantity ?? 0);
    if (remainingStock <= 0) return;

    setCart((previousCart) => {
      const existingCartItem = previousCart.find((item) => item.product.id === product.id);
      if (existingCartItem) {
        return updateCartItemQuantity(previousCart, product.id, existingCartItem.quantity + 1);
      }

      return [...previousCart, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((previousCart) => previousCart.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart((previousCart) => updateCartItemQuantity(previousCart, productId, newQuantity));
  };

  const applyCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
  };

  const calculateTotal = () => {
    return calculateCartTotal(cart, selectedCoupon);
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateTotal,
    selectedCoupon
  };
};
