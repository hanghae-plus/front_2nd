import { Coupon, DiscountType } from "../../types.ts";
import { useCouponForm } from "../hooks";
import { ChangeEvent, PropsWithChildren } from "react";

export interface Props {
  addNewCoupon: (newCoupon: Coupon) => void;
}

export function CouponForm({
  addNewCoupon,
  children,
}: PropsWithChildren<Props>) {
  const { couponForm, updateCouponFormField, resetCouponForm } =
    useCouponForm();

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateCouponFormField("name", e.target.value);
  };

  const handleCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateCouponFormField("code", e.target.value);
  };

  const handleDiscountTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    updateCouponFormField("discountType", e.target.value as DiscountType);
  };

  const handleDiscountValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateCouponFormField("discountValue", parseInt(e.target.value));
  };

  const handleAddButtonClick = () => {
    addNewCoupon(couponForm);
    resetCouponForm();
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="space-y-2 mb-4">
        <input
          type="text"
          placeholder="쿠폰 이름"
          value={couponForm.name}
          onChange={handleNameChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="쿠폰 코드"
          value={couponForm.code}
          onChange={handleCodeChange}
          className="w-full p-2 border rounded"
        />
        <div className="flex gap-2">
          <select
            value={couponForm.discountType}
            onChange={handleDiscountTypeChange}
            className="w-full p-2 border rounded"
          >
            <option value="amount">금액(원)</option>
            <option value="percentage">할인율(%)</option>
          </select>
          <input
            type="number"
            placeholder="할인 값"
            value={couponForm.discountValue}
            onChange={handleDiscountValueChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          onClick={handleAddButtonClick}
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          쿠폰 추가
        </button>
      </div>
      {children}
    </div>
  );
}
