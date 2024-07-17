import { Coupon, InputEventHandler, SelectEventHandler } from "@/types";
import { useState } from "react";
import CouponManagementCardView from "./view";

interface Props {
  coupons: Coupon[];
  onCouponAdd: (newCoupon: Coupon) => void;
}
const CouponManagementCard = ({ coupons, onCouponAdd }: Props) => {
  const [newCoupon, setNewCoupon] = useState<Coupon>({
    name: "",
    code: "",
    discountType: "percentage",
    discountValue: 0,
  });

  const onChangeNewCouponName: InputEventHandler = (event) =>
    setNewCoupon({ ...newCoupon, name: event.target.value });

  const onChangeNewCouponCode: InputEventHandler = (event) =>
    setNewCoupon({ ...newCoupon, code: event.target.value });

  const onChangeNewCouponType: SelectEventHandler = (event) =>
    setNewCoupon({
      ...newCoupon,
      discountType: event.target.value as "amount" | "percentage",
    });

  const onChangeNewCouponValue: InputEventHandler = (event) =>
    setNewCoupon({
      ...newCoupon,
      discountValue: parseInt(event.target.value),
    });

  const onClickAddCoupon = () => {
    onCouponAdd(newCoupon);
    setNewCoupon({
      name: "",
      code: "",
      discountType: "percentage",
      discountValue: 0,
    });
  };

  const props = {
    newCoupon,
    onChangeNewCouponName,
    onChangeNewCouponCode,
    onChangeNewCouponType,
    onChangeNewCouponValue,
    onClickAddCoupon,
    coupons,
  };

  return <CouponManagementCardView {...props} />;
};

export default CouponManagementCard;
