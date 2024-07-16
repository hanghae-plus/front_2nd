import { Coupon } from "@/types";
import ApplyCouponCardView from "./view";

interface Props {
  coupons: Coupon[];
  applyCoupon: (coupon: Coupon) => void;
  selectedCoupon: Coupon | null;
}

const ApplyCouponCard = ({ coupons, applyCoupon, selectedCoupon }: Props) => {
  const onChangeCouponSelect: React.ChangeEventHandler<HTMLSelectElement> = (
    event
  ) => applyCoupon(coupons[parseInt(event.target.value)]);

  const props = {
    coupons,
    selectedCoupon,
    onChangeCouponSelect,
  };

  return <ApplyCouponCardView {...props} />;
};

export default ApplyCouponCard;
