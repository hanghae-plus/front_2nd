import { useState } from 'react';

import { Coupon } from '../types.ts';

export const useCoupons = (initialCoupons: Coupon[]) => {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);

  const addCoupon = (newCoupon: Coupon) => {
    setCoupons((prevCoupon) => [...prevCoupon, newCoupon]);
  };
  const removeCoupon = (couponCode: string) => {
    setCoupons((prevCoupon) => prevCoupon.filter((coupon) => coupon.code !== couponCode));
  };
  const updateCoupon = (updatedCoupon: Coupon) => {
    setCoupons((prevCoupon) =>
      prevCoupon.map((coupon) => (coupon.code === updatedCoupon.code ? updatedCoupon : coupon))
    );
  };
  return { coupons, addCoupon, removeCoupon, updateCoupon };
};
