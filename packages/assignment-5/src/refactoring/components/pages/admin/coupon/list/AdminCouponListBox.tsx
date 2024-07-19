import { FC } from "react";
import { Coupon } from "../../../../../../types";

interface Props {
  items: Coupon[];
}

const AdminCouponListBox: FC<Props> = ({ items }) => {
  return (
    <div className="space-y-2">
      {items.map((coupon, index) => (
        <div
          key={index}
          data-testid={`coupon-${index + 1}`}
          className="bg-gray-100 p-2 rounded"
        >
          {coupon.name} ({coupon.code}):
          {coupon.discountType === "amount"
            ? `${coupon.discountValue}원`
            : `${coupon.discountValue}%`}{" "}
          할인
        </div>
      ))}
    </div>
  );
};

export default AdminCouponListBox;
