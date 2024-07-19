import { Coupon } from '../../types.ts';
import { useState } from 'react';

export const useCoupons = (initialCoupons: Coupon[]) => {
  const [coupons, setCoupons] = useState(initialCoupons);

  const addCoupon = (newCoupon: Coupon) => {
    setCoupons((pre) => [...pre, newCoupon]);
  };

  return { coupons, addCoupon };
};
