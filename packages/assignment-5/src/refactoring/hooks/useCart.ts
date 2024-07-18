import { useCallback, useMemo, useState } from 'react';

import type { CartItem, Coupon, Product } from '../../types';
import {
  calculateCartTotal,
  updateCartItemQuantity,
} from './utils/cartUtils.ts';

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const addToCart = useCallback(
    (product: Product) => {
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
    },
    [cart],
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      const updatedCart = updateCartItemQuantity({
        cart,
        productId,
        newQuantity: 0,
      });
      setCart(updatedCart);
    },
    [cart],
  );

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      const updatedCart = updateCartItemQuantity({
        cart,
        productId,
        newQuantity,
      });
      setCart(updatedCart);
    },
    [cart],
  );

  const applyCoupon = useCallback(
    (coupon: Coupon) => setSelectedCoupon(coupon),
    [],
  );

  const calculateTotal = useMemo(
    () => calculateCartTotal({ cart, selectedCoupon }),
    [cart, selectedCoupon],
  );
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
