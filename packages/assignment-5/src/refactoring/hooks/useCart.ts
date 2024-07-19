// useCart.ts
import { useState } from "react";
import { CartItem, Coupon, Product } from "../../types";
import { calculateCartTotal } from "./utils/cartUtils";

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const addToCart = (product: Product) => {
    if (cart.find((item) => item.product.id === product.id))
      setCart((prev: CartItem[]) =>
        prev.map((item: CartItem) => {
          return item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item;
        })
      );
    else setCart((prev) => [...prev, { product: product, quantity: 1 }]);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev: CartItem[]) => {
      return prev.filter((item: CartItem) => {
        return item.product.id !== productId;
      });
    });
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity)
      setCart((prev) =>
        prev.map((item: CartItem) =>
          item.product.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    else
      setCart((prev) => prev.filter((item) => item.product.id !== productId));
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
