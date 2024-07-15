import { useState } from "react";
import { Coupon } from "types";

export const useCoupon = (initialCoupons: Coupon[]) => {
  const [coupons, setCoupons] = useState(initialCoupons);

  const addCoupon = (coupon: Coupon) => {
    setCoupons([...coupons, coupon]);
  };

  return { coupons, addCoupon };
};
