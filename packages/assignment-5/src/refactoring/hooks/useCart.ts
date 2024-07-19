import React from 'react';
import { useState } from 'react';
import {
  updateCartItemQuantity,
  getMaxApplicableDiscount,
  calculateCartTotal,
  addCartItem
} from './utils/cartUtils';

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const addToCart = (product: Product) => {
    const remainingStock = getRemainingStock(product);
    if (remainingStock <= 0) return;

    setCart(prevCart => addCartItem(prevCart, product));
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart(prevCart => updateCartItemQuantity(prevCart, productId, newQuantity));
  };

  const calculateTotal = () => calculateCartTotal(cart, selectedCoupon);

  const getMaxDiscount = (discounts: { quantity: number; rate: number }[]) => {
    return discounts.reduce((max, discount) => Math.max(max, discount.rate), 0);
  };

  const getRemainingStock = (product: Product) => {
    const cartItem = cart.find(item => item.product.id === product.id);
    return product.stock - (cartItem?.quantity || 0);
  };

  const getAppliedDiscount = (item: CartItem) => getMaxApplicableDiscount(item);

  const applyCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
  };
  return {
    cart,
    selectedCoupon,
    addToCart,
    removeFromCart,
    updateQuantity,
    calculateTotal,
    getMaxDiscount,
    getRemainingStock,
    getAppliedDiscount,
    applyCoupon
  };
}
