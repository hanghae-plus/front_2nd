import { createContext, ReactNode } from "react";
import { useCoupon } from "hooks";
import { Coupon } from "types";

export const CouponContext = createContext<
  ReturnType<typeof useCoupon> | undefined
>(undefined);

export const CouponProvider = ({
  initialCoupons,
  children,
}: {
  initialCoupons: Coupon[];
  children: ReactNode;
}) => {
  const coupons = useCoupon(initialCoupons);
  return (
    <CouponContext.Provider value={coupons}>{children}</CouponContext.Provider>
  );
};
