import { Coupon } from '../../../types.ts';
import { CouponList } from './CouponList';
import { CouponForm } from './CouponForm';

interface Props {
  coupons: Coupon[];
  onCouponAdd: (newCoupon: Coupon) => void;
}

export const CouponAdministration = ({ coupons, onCouponAdd }: Props) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">쿠폰 관리</h2>
      <div className="bg-white p-4 rounded shadow">
        <CouponForm onCouponAdd={onCouponAdd} />
        <CouponList coupons={coupons} />
      </div>
    </div>
  );
};
