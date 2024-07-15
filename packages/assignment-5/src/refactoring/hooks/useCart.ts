// useCart.ts
import { useState } from "react";
import { CartItem, Coupon, Product } from "../../types";
import { calculateCartTotal, updateCartItemQuantity } from "./utils/cartUtils";

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const addToCart = (product: Product) => {
    setCart((prev: CartItem[]) => {
      return [...prev, { product: product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev: CartItem[]) => {
      return prev.filter((item: CartItem) => {
        return item.product.id !== productId;
      });
    });
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart((prev) =>
      prev.map((item: CartItem) =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const applyCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
  };

  const calculateTotal = () => {
    const totalBeforeDiscount = cart.reduce((ac: number, cu: CartItem) => {
      return ac + cu.product.price * cu.quantity;
    }, 0);
    const totalAfterDiscount = cart.reduce((ac: number, cu: CartItem) => {
      return ac + cu.product.price * cu.quantity;
    }, 0);
    const totalDiscount = 0;

    return {
      totalBeforeDiscount: totalBeforeDiscount,
      totalAfterDiscount: totalAfterDiscount,
      totalDiscount: totalDiscount,
    };
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
