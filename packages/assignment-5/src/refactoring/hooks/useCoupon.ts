import { Coupon } from "../../types.ts";
import { useState } from "react";

export const useCoupons = (initialCoupons: Coupon[]) => {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);

  /**
   * 쿠폰을 추가하는 함수
   * @param newCoupon
   */
  const addCoupon = (newCoupon: Coupon) => {
    setCoupons((prevCoupons) => [...prevCoupons, newCoupon]);
  };
  return { coupons, addCoupon };
};
