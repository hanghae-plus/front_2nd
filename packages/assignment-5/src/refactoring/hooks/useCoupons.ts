import { Coupon } from "@/types.ts";
import { useEffect, useState } from "react";
import apis from "../apis";

export const useCoupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  const addCoupon = (newCoupon: Coupon) => {
    setCoupons((prev) => [...prev, newCoupon]);
  };

  const initialize = () => {
    apis.getCoupons().then(setCoupons);
  };
  useEffect(initialize, []);

  return { coupons, addCoupon };
};
