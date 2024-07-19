import { Coupon } from '../../../types';

interface Props {
  index: number;
  coupon: Coupon;
  removeCoupon: (couponCode: string) => void;
}

export const CouponListItem = ({ index, coupon, removeCoupon }: Props) => {
  const handleClickRemoveCoupon = (couponCode: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      removeCoupon(couponCode);
    }
  };

  return (
    <div
      key={index}
      data-testid={`coupon-${index + 1}`}
      className="flex justify-between bg-gray-100 p-2 rounded"
    >
      <div>
        {coupon.name} ({coupon.code}):
        {coupon.discountType === 'amount'
          ? `${coupon.discountValue}원`
          : `${coupon.discountValue}%`}{' '}
        할인
      </div>
      <button
        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
        onClick={() => handleClickRemoveCoupon(coupon.code)}
      >
        삭제
      </button>
    </div>
  );
};
