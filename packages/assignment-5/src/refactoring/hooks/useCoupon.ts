import { Coupon } from '../../types.ts';
import { useState } from 'react';

export const useCoupons = (initialCoupons: Coupon[]) => {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons || []);

  const addCoupon = (newCoupon: Coupon) => {
    setCoupons((prevCoupons) => [...prevCoupons, newCoupon]);
  };

  const deleteCoupon = (deletedCoupon: Coupon) => {
    setCoupons((prevCoupons) =>
      prevCoupons.filter((coupon) => coupon.code !== deletedCoupon.code)
    );
  };

  return { coupons, addCoupon, deleteCoupon };
};
