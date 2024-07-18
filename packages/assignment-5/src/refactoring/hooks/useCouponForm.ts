import {
  Coupon,
  CouponForm,
  InputEventHandler,
  SelectEventHandler,
} from "@/types";
import { useState } from "react";
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
      setErrorMessage("쿠폰 이름을 입력해주세요");
      return;
    }
    if (!isValidCode) {
      setErrorMessage("쿠폰 코드를 입력해주세요");
      return;
    }
    if (
      couponForm.discountType === "percentage" &&
      !isValidDIscountPercentage
    ) {
      setErrorMessage("할인율을 0이상 100 이하의 값으로 입력해주세요.");
      return;
    }
    if (couponForm.discountType === "amount" && !isValidDiscountAmount) {
      setErrorMessage("할인 금액을 입력해주세요");
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
