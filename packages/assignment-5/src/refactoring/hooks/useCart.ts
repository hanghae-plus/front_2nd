// useCart.ts
import { useState } from "react";
import { CartItem, Coupon, Product } from "../../types";
import { calculateCartTotal, updateCartItemQuantity } from "../utils/cartUtils";

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const addToCart = (product: Product) => {
    const hasTargetCartItem = cart.some(
      (cartItem) => cartItem.product.id === product.id,
    );

    if (!hasTargetCartItem) {
      setCart((prevCart) => [...prevCart, { product, quantity: 1 }]);
      return;
    }

    updateQuantity(product.id, (currentQuantity) => currentQuantity + 1);
  };

  const removeFromCart = (productId: string) => {
    updateQuantity(productId, (currentQuantity) =>
      Math.max(currentQuantity - 1, 0),
    );
  };

  const updateQuantity = (
    productId: string,
    withCurrentQuantity: number | ((currentQuantity: number) => number),
  ) => {
    const targetProduct = cart.find(
      (cartItem) => cartItem.product.id === productId,
    );

    const currentQuantity = targetProduct?.quantity ?? 0;

    setCart((prev) =>
      updateCartItemQuantity(
        prev,
        productId,
        typeof withCurrentQuantity === "number"
          ? withCurrentQuantity
          : withCurrentQuantity(currentQuantity),
      ),
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
