import { Coupon } from "../../../../types.ts";
import { useState } from "react";
import { createEmptyCoupon } from "../utils";

export const useCouponForm = (onCouponAdd: (newCoupon: Coupon) => void) => {
  const [value, setValue] = useState<Coupon>(createEmptyCoupon());

  const submit = () => {
    onCouponAdd(value);
    setValue(createEmptyCoupon());
  };

  return { value, edit: setValue, submit };
};
