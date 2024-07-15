import React, { createContext, ReactNode } from "react";
import { useCoupon } from "hooks";
import { Coupon } from "types";

export const CouponContext = createContext<
  ReturnType<typeof useCoupon> | undefined
>(undefined);

export const CouponProvider: React.FC<{
  initialCoupons: Coupon[];
  children: ReactNode;
}> = ({ initialCoupons, children }) => {
  const coupons = useCoupon(initialCoupons);
  return (
    <CouponContext.Provider value={coupons}>{children}</CouponContext.Provider>
  );
};
