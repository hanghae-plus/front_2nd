import { useState } from "react";
import { Coupon } from "../model/coupons/coupons.type";

export const useCoupons = (initialCoupons: Coupon[]) => {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);

  const addCoupon = (coupon: Coupon) => {
    setCoupons([...coupons, coupon]);
  };

  const removeCoupon = (coupon: Coupon) => {
    setCoupons(
      coupons.filter((selectedCoupon) => coupon.code !== selectedCoupon.code)
    );
  };

  return { coupons, addCoupon, removeCoupon };
};
