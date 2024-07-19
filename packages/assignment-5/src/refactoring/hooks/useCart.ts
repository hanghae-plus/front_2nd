// useCart.ts
import { useState } from 'react';
import { CartItem, Coupon, Product } from '../../types';
import {
  calculateCartTotal,
  getCartItem,
  updateCartItemQuantity,
} from './utils/cartUtils';
import { MODIFY_QUANTITY } from '../constants';

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const addToCart = (product: Product) => {
    let hasCartItem = false;
    const newCartItem = getCartItem(cart, product);
    newCartItem.quantity += MODIFY_QUANTITY;
    const newCart = cart.map((cartItem) => {
      if (cartItem.product.id === product.id) {
        hasCartItem = true;
        return newCartItem;
      }
      return cartItem;
    });
    if (!hasCartItem) newCart.push(newCartItem);
    setCart(newCart);
  };

  const removeFromCart = (productId: string) => {
    const newCart = cart.filter((item) => item.product.id !== productId);
    setCart(newCart);
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    const cartItem = getCartItem(
      cart,
      cart.find((item) => item.product.id === productId)?.product as Product,
    );
    if (newQuantity > cartItem.product.stock) return;
    if (newQuantity <= 0) return removeFromCart(productId);
    setCart(updateCartItemQuantity(cart, productId, newQuantity));
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
    selectedCoupon,
  };
};
