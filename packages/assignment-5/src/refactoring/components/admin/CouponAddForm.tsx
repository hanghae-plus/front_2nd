import { Coupon } from '../../../types';
import { useCouponAddForm } from '../../hooks/useCouponAddForm';

interface Props {
  onCouponAdd: (newCoupon: Coupon) => void;
}

export const CouponAddForm = ({ onCouponAdd }: Props) => {
  const {
    newCoupon,
    updateCouponName,
    updateCouponCode,
    updateCouponDiscountType,
    updateCouponDiscountValue,
    resetNewCoupon,
    checkAllDataFilled,
  } = useCouponAddForm();

  const handleAddCoupon = () => {
    if (checkAllDataFilled()) {
      onCouponAdd(newCoupon);
      resetNewCoupon();
    } else {
      alert('모든 값을 입력한 후에 추가해주세요.');
    }
  };

  return (
    <div className="space-y-2 mb-4">
      <input
        type="text"
        placeholder="쿠폰 이름"
        value={newCoupon.name}
        onChange={(e) => updateCouponName(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="쿠폰 코드"
        value={newCoupon.code}
        onChange={(e) => updateCouponCode(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <div className="flex gap-2">
        <select
          value={newCoupon.discountType}
          onChange={(e) =>
            updateCouponDiscountType(e.target.value as 'percentage' | 'amount')
          }
          className="w-full p-2 border rounded"
        >
          <option value="amount">금액(원)</option>
          <option value="percentage">할인율(%)</option>
        </select>
        <input
          type="number"
          placeholder="할인 값"
          value={newCoupon.discountValue}
          onChange={(e) => updateCouponDiscountValue(Number(e.target.value))}
          className="w-full p-2 border rounded"
        />
      </div>
      <button
        onClick={handleAddCoupon}
        className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
      >
        쿠폰 추가
      </button>
    </div>
  );
};
