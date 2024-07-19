import { Coupon } from '@types';

interface CouponListProps {
  coupons: Coupon[];
}

const CouponList = ({ coupons }: CouponListProps) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">현재 쿠폰 목록</h3>
      <div className="space-y-2">
        {coupons.map((coupon, index) => (
          <div key={index} data-testid={`coupon-${index + 1}`} className="bg-gray-100 p-2 rounded">
            <span className="font-medium">{coupon.name}</span> ({coupon.code}):
            {coupon.discountType === 'amount' ? `${coupon.discountValue}원 할인` : `${coupon.discountValue}% 할인`}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CouponList;
