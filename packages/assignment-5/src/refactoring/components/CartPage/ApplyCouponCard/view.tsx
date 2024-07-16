import { Coupon } from "@/types";

interface Props {
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  onChangeCouponSelect: React.ChangeEventHandler<HTMLSelectElement>;
}

const ApplyCouponCardView = ({
  coupons,
  selectedCoupon,
  onChangeCouponSelect,
}: Props) => {
  return (
    <div className="mt-6 bg-white p-4 rounded shadow">
      <h2 className="text-2xl font-semibold mb-2">쿠폰 적용</h2>
      <CouponSelect
        coupons={coupons}
        onChangeCouponSelect={onChangeCouponSelect}
      />
      {selectedCoupon && (
        <AppliedCouponInform selectedCoupon={selectedCoupon} />
      )}
    </div>
  );
};
// TODO: selectedCoupon이 "쿠폰 선택"으로 옵션을 바꾸면 null이 아니라 string이 됨. 타입 변경 필요

interface CouponSelectProps {
  onChangeCouponSelect: React.ChangeEventHandler<HTMLSelectElement>;
  coupons: Coupon[];
}
const CouponSelect = ({ onChangeCouponSelect, coupons }: CouponSelectProps) => {
  return (
    <select
      onChange={onChangeCouponSelect}
      className="w-full p-2 border rounded mb-2"
    >
      <option value="">쿠폰 선택</option>
      {coupons.map((coupon, index) => (
        <CouponOption coupon={coupon} index={index} />
      ))}
    </select>
  );
};

interface CouponOptionProps {
  coupon: Coupon;
  index: number;
}
const CouponOption = ({ coupon, index }: CouponOptionProps) => {
  return (
    <option key={coupon.code} value={index}>
      {coupon.name} -{" "}
      {coupon.discountType === "amount"
        ? `${coupon.discountValue}원`
        : `${coupon.discountValue}%`}
    </option>
  );
};

interface AppliedCouponInformProps {
  selectedCoupon: Coupon;
}
const AppliedCouponInform = ({
  selectedCoupon: { name, discountType, discountValue },
}: AppliedCouponInformProps) => {
  return (
    <p className="text-green-600">
      적용된 쿠폰: {name}(
      {discountType === "amount" ? `${discountValue}원` : `${discountValue}%`}{" "}
      할인)
    </p>
  );
};

export default ApplyCouponCardView;
