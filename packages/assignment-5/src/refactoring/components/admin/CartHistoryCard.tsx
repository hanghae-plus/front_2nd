import { Coupon } from "../../../types";
import { useForm } from "../../hooks";

interface CartHistoryCardProps {
  coupons: Coupon[];
  addCoupon: (newCoupon: Coupon) => void;
}

const CartHistoryCard = ({ coupons, addCoupon }: CartHistoryCardProps) => {
  const { formState, submitForm, register } = useForm<Coupon>({
    name: "",
    code: "",
    discountType: "percentage",
    discountValue: 0,
  });

  const handleCouponAddFormSubmit = (event: React.FormEvent) => {
    submitForm(event);
    addCoupon(formState);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">쿠폰 관리</h2>
      <div className="bg-white p-4 rounded shadow">
        <form className="space-y-2 mb-4" onSubmit={handleCouponAddFormSubmit}>
          <input
            type="text"
            placeholder="쿠폰 이름"
            value={formState.name}
            {...register("name")}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="쿠폰 코드"
            value={formState.code}
            {...register("code")}
            required
            className="w-full p-2 border rounded"
          />
          <div className="flex gap-2">
            <select
              value={formState.discountType}
              {...register("discountType")}
              className="w-full p-2 border rounded"
            >
              <option value="amount">금액(원)</option>
              <option value="percentage">할인율(%)</option>
            </select>
            <input
              type="number"
              placeholder="할인 값"
              value={formState.discountValue}
              {...register("discountValue")}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            쿠폰 추가
          </button>
        </form>
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
                  ? `${coupon.discountValue}원`
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

export default CartHistoryCard;
