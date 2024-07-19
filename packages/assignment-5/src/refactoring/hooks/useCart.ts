import { useState } from "react";
import type { CartItemType, Coupon, Product } from "types";
import {
  calculateCartTotal,
  updateCartItemQuantity,
} from "hooks/utils/cartUtils";

export const useCart = () => {
  const [cartList, setCartList] = useState<CartItemType[]>([]);

  const addToCart = (product: Product) => {
    setCartList((prevCartList) => {
      const existingItem = prevCartList.find(
        (item) => item.product.id === product.id,
      );
      if (existingItem) {
        return prevCartList.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prevCartList, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartList((prevCartList) =>
      prevCartList.filter((cartItem) => cartItem.product.id !== productId),
    );
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 0) {
      return;
    }

    setCartList((prevCartList) =>
      updateCartItemQuantity({
        cartList: prevCartList,
        productId,
        newQuantity,
      }),
    );
  };

  const calculateTotal = (
    cartList: CartItemType[],
    selectedCoupon: Coupon | null,
  ) => calculateCartTotal({ cart: cartList, selectedCoupon });

  return {
    cartList,
    addToCart,
    removeFromCart,
    updateQuantity,
    calculateTotal,
  };
};
