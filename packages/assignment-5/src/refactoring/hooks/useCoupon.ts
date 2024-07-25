import { useState } from "react";
import { Coupon } from "types";

export const useCoupon = (initialCoupons: Coupon[]) => {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const addCoupon = (coupon: Coupon) => {
    setCoupons([...coupons, coupon]);
  };

  const applyCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
  };

  return { coupons, addCoupon, applyCoupon, selectedCoupon };
};
