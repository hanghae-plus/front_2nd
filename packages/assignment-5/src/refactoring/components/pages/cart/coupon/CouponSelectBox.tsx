import { FC } from "react";
import { Coupon } from "../../../../../types";

interface Props {
  items: Coupon[];
  applyCoupon: (coupon: Coupon) => void;
}

const CouponSelectBox: FC<Props> = ({ items, applyCoupon }) => {
  return (
    <select
      onChange={(e) => applyCoupon(items[parseInt(e.target.value)])}
      className="w-full p-2 border rounded mb-2"
    >
      <option value="">쿠폰 선택</option>
      {items.map((coupon, index) => (
        <option key={coupon.code} value={index}>
          {coupon.name} -{" "}
          {coupon.discountType === "amount"
            ? `${coupon.discountValue}원`
            : `${coupon.discountValue}%`}
        </option>
      ))}
    </select>
  );
};

export default CouponSelectBox;
