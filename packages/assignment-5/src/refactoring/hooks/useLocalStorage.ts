import { useCallback, useEffect, useRef } from 'react';
import { CartItem, Coupon } from '../../types';
import { useCart } from './useCart';
import { findIndexOfSelectedCoupon } from './utils/couponUtils';
import { debounce } from './utils/commonUtils';

export const useLocalStorage = () => {
  const {
    cart,
    cartItemsCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    checkAndApplyCoupon,
    calculateTotal,
    selectedCoupon,
    getRemainingStock,
    getAppliedDiscount,
  } = useCart();

  // debounce로 cart값 넘길 때 바뀐 값이 넘어가지 않아 ref로 지정
  const cartRef = useRef(cart);

  // localStorage 업데이트는 debounce 적용
  // eslint-disable-next-line
  const debouncedCart = useCallback(
    debounce(() => storeCartToLocal(cartRef.current)),
    []
  );

  useEffect(() => {
    const getLocalCart = () => {
      try {
        const storedCart = localStorage.getItem('cart');
        if (!storedCart) return;
        JSON.parse(storedCart).forEach(({ product, quantity }: CartItem) => {
          addToCart(product);
          updateQuantity(product.id, quantity);
        });
      } catch (e) {
        console.error(e);
      }
    };

    const getLocalCoupon = () => {
      try {
        const storedCoupon = localStorage.getItem('coupon');
        if (!storedCoupon) return;
        applyCoupon(JSON.parse(storedCoupon));
      } catch (e) {
        console.error(e);
      }
    };

    getLocalCart();
    getLocalCoupon();
    // eslint-disable-next-line
  }, []); // warning 권장대로 값 넣으면 무한루프발생 => eslint ignore

  useEffect(() => {
    cartRef.current = cart;
    debouncedCart();
    // eslint-disable-next-line
  }, [cart]);

  useEffect(() => {
    storeCouponToLocal(selectedCoupon);
  }, [selectedCoupon]);

  const storeCartToLocal = (cart: CartItem[]) => {
    localStorage.setItem('cart', JSON.stringify(cart));
  };

  const storeCouponToLocal = (selectedCoupon: Coupon | null) => {
    // 쿠폰 적용 해제 시 local에서 coupon 삭제
    if (!selectedCoupon) localStorage.removeItem('coupon');
    else localStorage.setItem('coupon', JSON.stringify(selectedCoupon));
  };

  const getAppliedCouponIndex = (coupons: Coupon[]) => {
    if (!selectedCoupon) return '';
    return findIndexOfSelectedCoupon(coupons, selectedCoupon);
  };

  return {
    cart,
    cartItemsCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    checkAndApplyCoupon,
    calculateTotal,
    selectedCoupon,
    getAppliedCouponIndex,
    getRemainingStock,
    getAppliedDiscount,
  };
};
