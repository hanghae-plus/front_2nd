import type { Coupon } from "types";

import AddNewCoupon from "./AddNewCoupon";
import CouponList from "./CouponList";

interface ManageCouponProps {
  coupons: Coupon[];
  onAddCoupon: (coupon: Coupon) => void;
}

const ManageCoupon = ({ coupons, onAddCoupon }: ManageCouponProps) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">쿠폰 관리</h2>
      <div className="bg-white p-4 rounded shadow">
        <div className="space-y-2 mb-4">
          <AddNewCoupon onAddCoupon={onAddCoupon} />
        </div>
        <CouponList coupons={coupons} />
      </div>
    </div>
  );
};

export default ManageCoupon;
