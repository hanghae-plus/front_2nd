import { useState } from "react";
import { Discount } from "../../types.ts";

const initialState = {
  rate: 0,
  quantity: 0,
};

export const useDiscountForm = () => {
  const [discountForm, setDiscountForm] = useState<Discount>(initialState);

  const updateDiscountFormField = <F extends keyof Discount>(
    field: F,
    value: Discount[F],
  ) => {
    setDiscountForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetDiscountForm = () => {
    setDiscountForm(initialState);
  };

  return {
    discountForm,
    updateDiscountFormField,
    resetDiscountForm,
  };
};
