import { useDiscountForm } from "../hooks";
import { ChangeEvent } from "react";
import { Discount } from "../../types.ts";

export interface Props {
  addDiscount: (discount: Discount) => void;
}

export function DiscountForm({ addDiscount }: Props) {
  const { discountForm, updateDiscountFormField, resetDiscountForm } =
    useDiscountForm();

  const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateDiscountFormField("quantity", parseInt(e.target.value));
  };

  const handleRateChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateDiscountFormField("rate", parseInt(e.target.value) / 100);
  };

  const handleAddDiscount = () => {
    addDiscount(discountForm);
    resetDiscountForm();
  };

  return (
    <div className="flex space-x-2">
      <input
        type="number"
        placeholder="수량"
        value={discountForm.quantity}
        onChange={handleQuantityChange}
        className="w-1/3 p-2 border rounded"
      />
      <input
        type="number"
        placeholder="할인율 (%)"
        value={discountForm.rate * 100}
        onChange={handleRateChange}
        className="w-1/3 p-2 border rounded"
      />
      <button
        onClick={handleAddDiscount}
        className="w-1/3 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        할인 추가
      </button>
    </div>
  );
}
