// useCart.ts
import React, { useState } from "react";
import { CartItem, Coupon, Product } from "../../types";
import { calculateCartTotal, updateCartItemQuantity } from "./utils/cartUtils";

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const addToCart = React.useCallback((product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.product.id === product.id
      );
      if (existingItem) {
        return updateCartItemQuantity(
          prevCart,
          product.id,
          existingItem.quantity + 1
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = React.useCallback((productId: string) => {
    const filterCart = cart.filter((value) => value.product.id !== productId);
    setCart(filterCart);
    return;
  }, []);

  const updateQuantity = React.useCallback(
    (productId: string, newQuantity: number) => {
      setCart((prevCart) =>
        updateCartItemQuantity(prevCart, productId, newQuantity)
      );
      return;
    },
    [cart]
  );

  const applyCoupon = React.useCallback((coupon: Coupon) => {
    setSelectedCoupon(coupon);
    return;
  }, []);

  const calculateTotal = React.useCallback(() => {
    return calculateCartTotal(cart, selectedCoupon);
  }, [cart, selectedCoupon]);

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
