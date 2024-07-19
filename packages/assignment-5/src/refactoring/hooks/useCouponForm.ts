import { useState } from "react";
import { Coupon } from "../../types";

export const useCouponForm = (onCouponAdd: (newCoupon: Coupon) => void) => {
  const [newCoupon, setNewCoupon] = useState<Coupon>({
    name: "",
    code: "",
    discountType: "percentage",
    discountValue: 0,
  });

  const setCouponProperty = <K extends keyof Coupon>(
    key: K,
    value: Coupon[K]
  ) => {
    setNewCoupon({ ...newCoupon, [key]: value });
  };

  const submit = () => {
    onCouponAdd(newCoupon);
    setNewCoupon({
      name: "",
      code: "",
      discountType: "percentage",
      discountValue: 0,
    });
  };

  return {
    newCoupon,
    setCouponProperty,
    submit,
  };
};
