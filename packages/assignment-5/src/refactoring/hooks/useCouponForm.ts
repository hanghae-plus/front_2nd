import { useState, useCallback } from "react";
import { Coupon } from "../../types";

const initialCouponState: Coupon = {
  name: "",
  code: "",
  discountType: "percentage",
  discountValue: 0,
};

export const useCouponForm = (onCouponAdd: (newCoupon: Coupon) => void) => {
  const [coupon, setCoupon] = useState<Coupon>(initialCouponState);

  const changeItem = useCallback((updatedCoupon: Coupon) => {
    setCoupon(updatedCoupon);
  }, []);

  const submit = useCallback(() => {
    if (coupon.name && coupon.code && coupon.discountValue > 0) {
      onCouponAdd(coupon);
      setCoupon(initialCouponState);
    }
  }, [coupon, onCouponAdd]);

  return {
    coupon,
    changeItem,
    submit,
  };
};
