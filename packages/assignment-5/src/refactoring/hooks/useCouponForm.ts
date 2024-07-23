// src/hooks/useCouponForm.ts
import { useState } from 'react';
import { Coupon } from '../../types';

const initialCouponState: Coupon = {
  name: '',
  code: '',
  discountType: 'percentage',
  discountValue: 0
};

export const useCouponForm = (onAddCoupon: (coupon: Coupon) => void) => {
  const [coupon, setCoupon] = useState<Coupon>(initialCouponState);

  const updateCouponField = (field: keyof Coupon, value: string | number) => {
    setCoupon(prev => ({ ...prev, [field]: value }));
  };

  const handleAddCoupon = () => {
    onAddCoupon(coupon);
    setCoupon(initialCouponState);
  };

  return {
    coupon,
    updateCouponField,
    handleAddCoupon
  };
};