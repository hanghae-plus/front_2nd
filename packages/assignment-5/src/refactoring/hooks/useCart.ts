// useCart.ts
import { useEffect, useState } from "react";
import { CartItem, Coupon, Product } from "../../types";
import {
  calculateCartTotal,
  getRemainingStock,
  updateCartItemQuantity,
} from "./utils/cartUtils";
import { useLocalStorage } from "./useLocalStorage";

export const useCart = () => {
  const { getStorageByKey, setStorageByKey } = useLocalStorage("cart-item", []);

  //게으른 초기화
  const [cart, setCart] = useState<CartItem[]>(() =>
    getStorageByKey("cart-item", [])
  );

  /**
   * cart내부 값이 변경될 때 마다 localStorage 갱신
   */
  useEffect(() => setStorageByKey("cart-item", cart), [cart, setStorageByKey]);

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

      const newCart = [...prevCart, { product, quantity: 1 }];
      return newCart;
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
   * 쿠폰 적용 관심사
   */
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  /**최종 값 */
  const calculateTotal = calculateCartTotal(cart, selectedCoupon);

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
