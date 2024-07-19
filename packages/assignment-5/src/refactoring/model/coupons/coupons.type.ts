export interface Coupon {
  name: string;
  code: string;
}

export interface DiscountCoupon extends Coupon {
  discountType: DiscountType;
  discountValue: number;
}

export type DiscountType = "amount" | "percentage";
