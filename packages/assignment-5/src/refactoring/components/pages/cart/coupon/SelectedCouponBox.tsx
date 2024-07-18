import { FC } from "react";
import { Coupon } from "../../../../../types";

interface Props {
  item: Coupon | null;
}

const SelectedCouponBox: FC<Props> = ({ item }) => {
  return (
    <p className="text-green-600">
      적용된 쿠폰: {item?.name}(
      {item?.discountType === "amount"
        ? `${item?.discountValue}원`
        : `${item?.discountValue}%`}{" "}
      할인)
    </p>
  );
};

export default SelectedCouponBox;
