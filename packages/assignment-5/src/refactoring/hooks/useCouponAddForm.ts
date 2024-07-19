import { useState } from 'react';
import { Coupon } from '../../types';
import { checkAllCouponDataFilled } from '../hooks/utils/couponUtils';

type DiscountType = 'percentage' | 'amount';
const initialNewCoupon = {
  name: '',
  code: '',
  discountType: 'percentage' as DiscountType,
  discountValue: 0,
};

export const useCouponAddForm = () => {
  const [newCoupon, setNewCoupon] = useState<Coupon>(initialNewCoupon);

  const updateCouponName = (newNameValue: string) => {
    setNewCoupon((prevCoupon) => {
      return { ...prevCoupon, name: newNameValue };
    });
  };

  const updateCouponCode = (newCodeValue: string) => {
    setNewCoupon((prevCoupon) => {
      return { ...prevCoupon, code: newCodeValue };
    });
  };

  const updateCouponDiscountType = (newTypeValue: DiscountType) => {
    setNewCoupon((prevCoupon) => {
      return { ...prevCoupon, discountType: newTypeValue };
    });
  };

  const updateCouponDiscountValue = (newDiscountValue: number) => {
    setNewCoupon((prevCoupon) => {
      return { ...prevCoupon, discountValue: newDiscountValue };
    });
  };

  const resetNewCoupon = () => {
    setNewCoupon(initialNewCoupon);
  };

  // 모든 input이 채워졌는지 확인
  const checkAllDataFilled = () => {
    return checkAllCouponDataFilled(newCoupon);
  };

  return {
    newCoupon,
    updateCouponName,
    updateCouponCode,
    updateCouponDiscountType,
    updateCouponDiscountValue,
    resetNewCoupon,
    checkAllDataFilled,
  };
};
