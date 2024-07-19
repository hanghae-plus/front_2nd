import { Coupon } from "types";

export const formatDiscount = (coupon: Coupon) => {
  const value = coupon.discountValue.toLocaleString();
  return coupon.discountType === "amount" ? `${value}원` : `${value}%`;
};
