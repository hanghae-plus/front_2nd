import { ChangeEvent, useState } from 'react';
import { useStore } from 'zustand';
import { type Coupon, couponStore } from '~entities';

const INIT_NEW_COUPON: Coupon = {
  code: '',
  discountType: 'amount',
  discountValue: 0,
  name: '',
};
export function CouponForm() {
  const [newCoupon, setNewCoupon] = useState<Coupon>(INIT_NEW_COUPON);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    type: keyof Coupon
  ) => {
    const newValue =
      e.target.type === 'number' ? parseInt(e.target.value) : e.target.value;
    setNewCoupon((preState) => ({
      ...preState,
      [type]: newValue,
    }));
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    if (newValue === 'amount' || newValue === 'percentage') {
      setNewCoupon((preState) => ({
        ...preState,
        discountType: newValue,
      }));
    }
  };

  const addCoupon = useStore(couponStore, (state) => state.addCoupon);
  const handleAddClick = () => {
    addCoupon(newCoupon);
  };

  const props: CouponFormViewProps = {
    newCoupon: newCoupon,
    handleSelectChange: handleSelectChange,
    handleInputChange: handleInputChange,
    handleAddClick: handleAddClick,
  };

  return <CouponFormView {...props} />;
}
type CouponFormViewProps = {
  newCoupon: Coupon;
  handleSelectChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  handleAddClick: () => void;
  handleInputChange: (
    e: ChangeEvent<HTMLInputElement>,
    type: keyof Coupon
  ) => void;
};

function CouponFormView({
  newCoupon,
  handleAddClick,
  handleInputChange,
  handleSelectChange,
}: CouponFormViewProps) {
  return (
    <>
      <input
        type="text"
        placeholder="쿠폰 이름"
        value={newCoupon.name}
        onChange={(e) => handleInputChange(e, 'name')}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="쿠폰 코드"
        value={newCoupon.code}
        onChange={(e) => handleInputChange(e, 'code')}
        className="w-full p-2 border rounded"
      />
      <div className="flex gap-2">
        <select
          value={newCoupon.discountType}
          onChange={handleSelectChange}
          className="w-full p-2 border rounded"
        >
          <option value="amount">금액(원)</option>
          <option value="percentage">할인율(%)</option>
        </select>
        <input
          type="number"
          placeholder="할인 값"
          value={newCoupon.discountValue}
          onChange={(e) => handleInputChange(e, 'discountValue')}
          className="w-full p-2 border rounded"
        />
      </div>
      <button
        onClick={handleAddClick}
        className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
      >
        쿠폰 추가
      </button>
    </>
  );
}
