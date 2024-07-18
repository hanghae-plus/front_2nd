import useCouponForm from "@/refactoring/hooks/useCouponForm";
import { Coupon } from "@/types";
import CouponManagementCardView from "./view";

interface Props {
  coupons: Coupon[];
  onCouponAdd: (newCoupon: Coupon) => void;
}
const CouponManagementCard = ({ coupons, onCouponAdd }: Props) => {
  const couponForm = useCouponForm(onCouponAdd);

  const props = {
    couponForm,
    coupons,
  };

  return <CouponManagementCardView {...props} />;
};

export default CouponManagementCard;
