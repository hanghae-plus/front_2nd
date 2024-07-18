import { Coupon } from '../../types.ts';
import { useState } from 'react';

export const useCoupons = (initialCoupons: Coupon[]) => {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  return {
    coupons,
    addCoupon: (newCoupon: Coupon) => {
      setCoupons((prevCoupons) => [...prevCoupons, newCoupon]);
    },
  };
};
