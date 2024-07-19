import { Coupon } from '../../types.ts';
import { useState, useEffect } from 'react';

export const useCoupons = (
  initialCoupons: Coupon[],
  onAddCoupon?: (newCoupons: Coupon[]) => void
) => {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);

  // 쿠폰을 추가하는 함수
  const addCoupon = (newCoupon: Coupon) => {
    setCoupons(prevCoupons => [...prevCoupons, newCoupon]);
  };

  useEffect(() => {
    onAddCoupon?.(coupons);
  }, [coupons]);

  return { coupons, addCoupon };
};
