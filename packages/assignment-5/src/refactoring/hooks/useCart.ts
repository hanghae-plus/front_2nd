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

  const addToCart = (product: Product) => {
    const targetProductIndex = cart.findIndex(
      (item) => item.product.id === product.id
    );

    const newCart = [...cart];

    if (targetProductIndex < 0) {
      newCart.push({ product, quantity: 1 });
    } else {
      newCart[targetProductIndex].quantity += 1;
    }

    setCart(newCart);
  };

  const removeFromCart = (productId: string) => {
    const targetProductIndex = cart.findIndex(
      (item) => item.product.id === productId
    );

    if (targetProductIndex < 0) {
      setCart((prev) => {
        const temp = [...prev];
        temp.splice(targetProductIndex, 1);
        return temp;
      });
    }
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart((prev) => {
      return updateCartItemQuantity(prev, productId, newQuantity);
    });
  };

  const applyCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
  };

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
