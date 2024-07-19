import { ChangeEvent } from 'react';
import { type Coupon, couponStore } from '~entities';
import { useStore } from 'zustand';

type CouponApplyProps = {
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
};

export function CouponApply({ coupons, selectedCoupon }: CouponApplyProps) {
  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    applyCoupon(coupons[parseInt(event.target.value)]);
  };

  const applyCoupon = useStore(couponStore, (state) => state.applyCoupon);

  const props: CouponApplyViewProps = {
    coupons: coupons,
    selectedCoupon: selectedCoupon,
    handleSelectChange: handleSelectChange,
  };
  return <CouponApplyView {...props} />;
}
type CouponApplyViewProps = CouponApplyProps & {
  handleSelectChange: (event: ChangeEvent<HTMLSelectElement>) => void;
};

function CouponApplyView({
  coupons,
  selectedCoupon,
  handleSelectChange,
}: CouponApplyViewProps) {
  return (
    <div className="mt-6 bg-white p-4 rounded shadow">
      <h2 className="text-2xl font-semibold mb-2">쿠폰 적용</h2>
      <select
        onChange={handleSelectChange}
        className="w-full p-2 border rounded mb-2"
      >
        <option value="">쿠폰 선택</option>
        {coupons.map((coupon, index) => (
          <option key={coupon.code} value={index}>
            {coupon.name} -{' '}
            {coupon.discountType === 'amount'
              ? `${coupon.discountValue}원`
              : `${coupon.discountValue}%`}
          </option>
        ))}
      </select>
      {selectedCoupon && (
        <p className="text-green-600">
          적용된 쿠폰: {selectedCoupon.name}(
          {selectedCoupon.discountType === 'amount'
            ? `${selectedCoupon.discountValue}원`
            : `${selectedCoupon.discountValue}%`}{' '}
          할인)
        </p>
      )}
    </div>
  );
}
