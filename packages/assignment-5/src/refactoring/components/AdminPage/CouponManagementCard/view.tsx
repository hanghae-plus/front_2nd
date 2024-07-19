import useCouponForm from "@/refactoring/hooks/useCouponForm";
import { wonFormatter } from "@/refactoring/utils/currencyFormatter";
import { Coupon } from "@/types";

interface Props {
  couponForm: ReturnType<typeof useCouponForm>;
  coupons: Coupon[];
}
const CouponManagementCardView = ({ couponForm, coupons }: Props) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">쿠폰 관리</h2>
      <div className="bg-white p-4 rounded shadow">
        <div className="space-y-2 mb-4">
          <input
            type="text"
            placeholder="쿠폰 이름"
            value={couponForm.couponForm.name}
            onChange={couponForm.onChangeNewCouponName}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="쿠폰 코드"
            value={couponForm.couponForm.code}
            onChange={couponForm.onChangeNewCouponCode}
            className="w-full p-2 border rounded"
          />
          <div className="flex gap-2">
            <select
              value={couponForm.couponForm.discountType}
              onChange={couponForm.onChangeNewCouponType}
              className="w-full p-2 border rounded"
            >
              <option value="amount">금액(원)</option>
              <option value="percentage">할인율(%)</option>
            </select>
            <input
              type="number"
              placeholder="할인 값"
              value={couponForm.couponForm.discountValue}
              onChange={couponForm.onChangeNewCouponValue}
              className="w-full p-2 border rounded"
            />
          </div>
          {couponForm.errorMessage && (
            <div className="text-red-500">{couponForm.errorMessage}</div>
          )}
          <button
            onClick={couponForm.onClickAddCoupon}
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            쿠폰 추가
          </button>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">현재 쿠폰 목록</h3>
          <div className="space-y-2">
            {coupons.map((coupon, index) => (
              <div
                key={index}
                data-testid={`coupon-${index + 1}`}
                className="bg-gray-100 p-2 rounded"
              >
                {coupon.name} ({coupon.code}):
                {coupon.discountType === "amount"
                  ? `${wonFormatter(coupon.discountValue)}`
                  : `${coupon.discountValue}%`}{" "}
                할인
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponManagementCardView;
