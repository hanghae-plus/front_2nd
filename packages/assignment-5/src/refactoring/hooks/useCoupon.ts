import { useState } from 'react';
import { Coupon } from '../../types';

export const useCoupons = (initialCoupons: Coupon[]) => {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);

  const addCoupon = (coupon: Coupon) => {
    setCoupons(prevCoupons => [...prevCoupons, coupon]);
  };

  return {
    coupons,
    addCoupon,
  };
};
