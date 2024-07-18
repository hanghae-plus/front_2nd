// useCart.ts
import { useState } from 'react';
import { CartItem, Coupon, Product } from '../../types';
import { calculateCartTotal, updateCartItemQuantity } from './utils/cartUtils';
import { getLocalStorage } from './utils/storageUtils';

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>(getLocalStorage('myCart') || []);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const addToCart = (product: Product) => {
    const productId = product.id;
    const existedItem = cart.find((item) => item.product.id === productId);

    if (existedItem) {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.product.id === productId
            ? { product, quantity: item.quantity + 1 }
            : item
        )
      );
      return;
    }

    setCart([...cart, { product, quantity: 1 }]);
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart((prevCart) =>
      updateCartItemQuantity(prevCart, productId, newQuantity)
    );
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
