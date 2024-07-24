import { Coupon } from "../../types.ts";
import { useState } from "react";



/**
export interface Coupon {
  name: string;
  code: string;
  discountType: 'amount' | 'percentage';
  discountValue: number;
}
 */
/*
const newCoupon: Coupon = { 
  name: 'New Coupon', 
  code: 'NEWCODE', 
  discountType: 'amount', 
  discountValue: 5000 
  };
*/
export const useCoupons = (initialCoupons: Coupon[]) => {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);

  const addCoupon = (newCoupon: Coupon) => {
    setCoupons(prevCoupons => [...prevCoupons, newCoupon]);
  };

  return {
    coupons,
    addCoupon,
  };
};
