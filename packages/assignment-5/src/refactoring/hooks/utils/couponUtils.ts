import { Coupon } from '../../../types';

export const removeFromCouponsByCode = (
  coupons: Coupon[],
  couponCode: string
) => {
  return coupons.filter((coupon) => coupon.code !== couponCode);
};

export const findIndexOfSelectedCoupon = (
  coupons: Coupon[],
  selectedCoupon: Coupon
) => {
  return coupons.findIndex((coupon) => coupon.code === selectedCoupon.code);
};

export const checkAllCouponDataFilled = (coupon: Coupon) => {
  return Object.values(coupon).every((value) => {
    if (typeof value === 'string' && value === '') return false;
    if (typeof value === 'number' && value === 0) return false;
    return true;
  });
};
