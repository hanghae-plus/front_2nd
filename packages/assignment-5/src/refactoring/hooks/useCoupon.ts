import { Coupon } from "@/types.ts";

export const useCoupons = (initialCoupons: Coupon[]) => {
  const coupons = structuredClone(initialCoupons);

  const addCoupon = (newCoupon: Coupon) => {
    coupons.push(newCoupon);
  };

  return { coupons, addCoupon };
};
