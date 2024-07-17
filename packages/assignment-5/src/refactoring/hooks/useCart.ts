// useCart.ts
import { useState } from "react";
import { CartItem, Coupon, Product } from "../../types";
import { calculateCartTotal, updateCartItemQuantity } from "./utils/cartUtils";

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const addToCart = (product: Product) => {
    const targetProduct = cart.find(
      (cartItem) => cartItem.product.id === product.id,
    );

    if (!targetProduct) {
      setCart((prevCart) => [...prevCart, { product, quantity: 1 }]);
      return;
    }

    setCart((prevCart) =>
      updateCartItemQuantity(prevCart, product.id, targetProduct.quantity + 1),
    );
  };

  const removeFromCart = (productId: string) => {
    const targetProduct = cart.find(
      (cartItem) => cartItem.product.id === productId,
    );

    const currentQuantity = targetProduct?.quantity ?? 0;

    setCart((prevCart) =>
      updateCartItemQuantity(
        prevCart,
        productId,
        Math.max(currentQuantity - 1, 0),
      ),
    );
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart((prevCart) =>
      updateCartItemQuantity(prevCart, productId, newQuantity),
    );
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
