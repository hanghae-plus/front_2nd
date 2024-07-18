import { FC } from "react";
import { Coupon } from "../../../../../../types";

interface Props {
  item: Coupon;
  changeItem: (item: Coupon) => void;
  handleAddItem: () => void;
}

const AdminCouponFormBox: FC<Props> = ({ item, changeItem, handleAddItem }) => {
  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) =>
    changeItem({ ...item, name: e.target.value });

  const handleChangeCode = (e: React.ChangeEvent<HTMLInputElement>) =>
    changeItem({ ...item, code: e.target.value });

  const handleChangeDiscountType = (e: React.ChangeEvent<HTMLSelectElement>) =>
    changeItem({
      ...item,
      discountType: e.target.value as "amount" | "percentage",
    });

  const handleChangeDiscountValue = (e: React.ChangeEvent<HTMLInputElement>) =>
    changeItem({
      ...item,
      discountValue: parseInt(e.target.value),
    });

  return (
    <div className="space-y-2 mb-4">
      <input
        type="text"
        placeholder="쿠폰 이름"
        value={item.name}
        onChange={handleChangeName}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="쿠폰 코드"
        value={item.code}
        onChange={handleChangeCode}
        className="w-full p-2 border rounded"
      />
      <div className="flex gap-2">
        <select
          value={item.discountType}
          onChange={handleChangeDiscountType}
          className="w-full p-2 border rounded"
        >
          <option value="amount">금액(원)</option>
          <option value="percentage">할인율(%)</option>
        </select>
        <input
          type="number"
          placeholder="할인 값"
          value={item.discountValue}
          onChange={handleChangeDiscountValue}
          className="w-full p-2 border rounded"
        />
      </div>
      <button
        onClick={handleAddItem}
        className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
      >
        쿠폰 추가
      </button>
    </div>
  );
};

export default AdminCouponFormBox;
