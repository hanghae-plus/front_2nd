// useCart.ts
import {
  calculateCartTotal,
  updateCartItemQuantity,
} from "@/refactoring/utils/cartUtils";
import { CartItem, Coupon, Product } from "@/types";
import { useState } from "react";

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const addToCart = (product: Product) =>
    setCart((prev) => {
      const productIndex = prev.findIndex(
        (item) => item.product.id === product.id
      );

      const newCart = [...prev];

      if (productIndex < 0) {
        return [...newCart, { product, quantity: 1 }];
      }

      newCart[productIndex].quantity++;
      return newCart;
    });

  const removeFromCart = (productId: string) =>
    setCart((prev) =>
      prev.filter((cartItem) => cartItem.product.id !== productId)
    );

  const updateQuantity = (productId: string, newQuantity: number) =>
    setCart((prev) => updateCartItemQuantity(prev, productId, newQuantity));

  const applyCoupon = (coupon: Coupon) => setSelectedCoupon(coupon);

  const calculateTotal = () => calculateCartTotal(cart, selectedCoupon);

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
