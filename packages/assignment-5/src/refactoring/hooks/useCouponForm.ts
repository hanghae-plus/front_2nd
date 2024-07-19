import { useState } from "react";
import { Coupon, DiscountType } from "../../types.ts";

const initialState = {
  name: "",
  code: "",
  discountType: "percentage" as DiscountType,
  discountValue: 0,
};

export const useCouponForm = () => {
  const [couponForm, setCouponForm] = useState<Coupon>(initialState);

  const updateCouponFormField = <F extends keyof Coupon>(
    field: F,
    value: Coupon[F],
  ) => {
    setCouponForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetCouponForm = () => {
    setCouponForm(initialState);
  };

  return {
    couponForm,
    updateCouponFormField,
    resetCouponForm,
  };
};
