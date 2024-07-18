import { useState } from 'react';
import { CartItem, Coupon, Product } from '../../types';
import { calculateCartTotal, updateCartItemQuantity } from './utils/cartUtils';

// 순수 함수로 분리
export const calculateRemainingStock = (product: Product, cartItems: CartItem[]) => {
  const cartItem = cartItems.find(item => item.product.id === product.id);
  return product.stock - (cartItem?.quantity || 0);
};

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const getRemainingStock = (product: Product) => {
    return calculateRemainingStock(product, cart);
  };

  const addToCart = (product: Product) => {
    const remainingStock = getRemainingStock(product);
    if (remainingStock <= 0) return;

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return updateCartItemQuantity(prevCart, product.id, existingItem.quantity + 1);
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId))
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart(prevCart => updateCartItemQuantity(prevCart, productId, newQuantity));
  };

  const applyCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
  };

  const calculateTotal = () => calculateCartTotal(cart, selectedCoupon);

  return {
    cart,
    getRemainingStock,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateTotal,
    selectedCoupon,
  };
};