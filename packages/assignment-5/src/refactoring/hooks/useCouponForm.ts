import {
  Coupon,
  CouponForm,
  InputEventHandler,
  SelectEventHandler,
} from "@/types";
import { useState } from "react";
import generateErrorMessage from "../utils/generateErrorMessage";
import { VALIDATION_CONDITIONS } from "../utils/validation";
import useFormValidation from "./useFormValidation";

const useCouponForm = (callback: (coupon: Coupon) => void) => {
  const [couponForm, setCouponForm] = useState<CouponForm>({
    name: "",
    code: "",
    discountType: "percentage",
    discountValue: "",
  });

  const [isValidName] = useFormValidation(
    VALIDATION_CONDITIONS.isNotEmpty,
    couponForm.name
  );
  const [isValidCode] = useFormValidation(
    VALIDATION_CONDITIONS.isNotEmpty,
    couponForm.code
  );
  const [isValidDiscountAmount] = useFormValidation(
    VALIDATION_CONDITIONS.isPositiveNumber,
    couponForm.discountValue
  );
  const [isValidDIscountPercentage] = useFormValidation(
    VALIDATION_CONDITIONS.isRate,
    couponForm.discountValue
  );
  const [errorMessage, setErrorMessage] = useState<string>("");

  const onChangeNewCouponName: InputEventHandler = (event) =>
    setCouponForm({ ...couponForm, name: event.target.value });

  const onChangeNewCouponCode: InputEventHandler = (event) =>
    setCouponForm({ ...couponForm, code: event.target.value });

  const onChangeNewCouponType: SelectEventHandler = (event) =>
    setCouponForm({
      ...couponForm,
      discountType: event.target.value as "amount" | "percentage",
    });

  const onChangeNewCouponValue: InputEventHandler = (event) =>
    setCouponForm({
      ...couponForm,
      discountValue: event.target.value,
    });

  const onClickAddCoupon = () => {
    if (!isValidName) {
      setErrorMessage(generateErrorMessage.formError("쿠폰 이름"));

      return;
    }
    if (!isValidCode) {
      setErrorMessage(generateErrorMessage.formError("쿠폰 코드"));

      return;
    }
    if (
      couponForm.discountType === "percentage" &&
      !isValidDIscountPercentage
    ) {
      setErrorMessage(
        generateErrorMessage.formError("할인율", "0 이상 100 이하의")
      );

      return;
    }
    if (couponForm.discountType === "amount" && !isValidDiscountAmount) {
      setErrorMessage(generateErrorMessage.formError("할인 금액"));

      return;
    }

    const newCoupon: Coupon = {
      ...couponForm,
      discountValue: parseInt(couponForm.discountValue),
    };
    callback(newCoupon);
    setCouponForm({
      name: "",
      code: "",
      discountType: "percentage",
      discountValue: "",
    });
    setErrorMessage("");
  };

  return {
    couponForm,
    onChangeNewCouponName,
    onChangeNewCouponCode,
    onChangeNewCouponType,
    onChangeNewCouponValue,
    onClickAddCoupon,
    errorMessage,
  };
};

export default useCouponForm;
