// useCart.ts
import { useState } from 'react';
import { CartItem, Coupon, Product } from '../../types';
import { calculateCartTotal, getCartItem, updateCartItemQuantity } from './utils/cartUtils';
import { addQuantity } from '../constants';

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  
  const addToCart = (product: Product) => {
    const newCartItem = getCartItem(cart, product)
    newCartItem.quantity += addQuantity
    const newCart = cart.map((cartItem) => {
      if(cartItem.product.id === product.id) return newCartItem
      return cartItem
    })
    if(!newCart.length) newCart.push(newCartItem)
    setCart(newCart);
  };

  const removeFromCart = (productId: string) => {};

  const updateQuantity = (productId: string, newQuantity: number) => {};

  const applyCoupon = (coupon: Coupon) => {};

  const calculateTotal = () => {
    
    
    return {
    totalBeforeDiscount: 0,
    totalAfterDiscount: 0,
    totalDiscount: 0,
  };
}

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
