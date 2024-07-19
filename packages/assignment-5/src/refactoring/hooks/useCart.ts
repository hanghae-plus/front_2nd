// useCart.ts
import { useState } from 'react';
import { CartItem, Coupon, Product } from '../../types';
import {
  calculateCartTotal,
  updateCartItemQuantity,
  getRemainingStockFromCart,
  getMaxApplicableDiscount,
  appendNewCartItem,
  filterCartByProductId,
} from './utils/cartUtils';

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const cartItemsCount = cart.length;

  const addToCart = (product: Product) => {
    setCart((prevCart) => appendNewCartItem(prevCart, product));
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => filterCartByProductId(prevCart, productId));
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart((prevCart) =>
      updateCartItemQuantity(prevCart, productId, newQuantity)
    );
  };

  const applyCoupon = (coupon: Coupon | null) => {
    setSelectedCoupon(coupon);
  };

  const calculateTotal = () => {
    return calculateCartTotal(cart, selectedCoupon);
  };

  const getRemainingStock = (product: Product) => {
    return getRemainingStockFromCart(cart, product);
  };

  const getAppliedDiscount = (item: CartItem) => {
    return getMaxApplicableDiscount(item);
  };

  const checkAndApplyCoupon = (
    e: React.ChangeEvent<HTMLSelectElement>,
    coupons: Coupon[]
  ) => {
    const selectedIndex = parseInt(e.target.value);
    if (cart.length === 0) {
      alert('장바구니에 상품이 있어야 쿠폰을 적용할 수 있습니다.');
      return;
    }
    if (!isNaN(selectedIndex) && selectedIndex >= 0) {
      applyCoupon(coupons[selectedIndex]);
    }
  };

  return {
    cart,
    cartItemsCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateTotal,
    checkAndApplyCoupon,
    selectedCoupon,
    getRemainingStock,
    getAppliedDiscount,
  };
};
