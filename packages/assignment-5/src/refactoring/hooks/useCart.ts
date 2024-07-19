// useCart.ts
import { useState } from "react";
import { CartItem, Coupon, Product } from "../../types";
import { calculateCartTotal, updateCartItemQuantity } from "./utils/cartUtils";

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const addToCart = (newProduct: Product) => {
    setCart((prevCart) => {
      const hasProduct = prevCart.some(
        ({ product }) => product.id === newProduct.id,
      );

      if (hasProduct) {
        return prevCart.map((cartItem) =>
          cartItem.product.id === newProduct.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        );
      }

      return [...prevCart, { product: newProduct, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) =>
      prevCart.filter(({ product }) => product.id !== productId),
    );
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart((prevCart) => {
      return updateCartItemQuantity(prevCart, productId, newQuantity);
    });
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
