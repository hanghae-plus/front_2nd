// useCart.ts
import { useState } from "react";
import { CartItem, Coupon, Product } from "../../types";
import {
  calculateCartTotal,
  getRemainingStock,
  updateCartItemQuantity,
} from "./utils/cartUtils";

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  /**최종 값 */
  const calculateTotal = calculateCartTotal(cart, selectedCoupon);

  /**
   * cart에 product를 추가하는 함수
   * @param product
   * @returns void
   */
  const addToCart = (product: Product) => {
    const remainingStock = getRemainingStock(product, cart);
    if (remainingStock <= 0) return;

    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.product.id === product.id
      );
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  /**
   * cart에서 상품을 제거하는 함수
   * @param productId
   */
  const removeFromCart = (productId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.product.id !== productId)
    );
  };

  /**
   * 수량을 업데이트 하는 함수
   * @param productId
   * @param newQuantity
   */
  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart((prevCart) =>
      updateCartItemQuantity(prevCart, productId, newQuantity)
    );
  };

  /**
   * setSelectedCoupon이라는 업데이트 함수가 있는데 굳이
   * 한번 더 래핑할 필요가 있을까..?
   */
  const applyCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
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
