import { Coupon } from '../../types.ts';
import { useState } from 'react';
import { removeFromCouponsByCode } from './utils/couponUtils.ts';

export const useCoupons = (initialCoupons: Coupon[]) => {
  const [coupons, setCoupons] = useState(initialCoupons);

  const addCoupon = (newCoupon: Coupon) => {
    setCoupons((prevCoupons) => [...prevCoupons, newCoupon]);
  };

  const removeCoupon = (couponCode: string) => {
    setCoupons((prevCoupons) =>
      removeFromCouponsByCode(prevCoupons, couponCode)
    );
  };

  return { coupons, addCoupon, removeCoupon };
};
