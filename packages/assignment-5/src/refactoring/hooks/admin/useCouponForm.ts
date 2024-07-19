import { useState } from 'react';

import { Coupon } from '../../../types';

export const useCouponForm = () => {
  const [newCoupon, setNewCoupon] = useState<Coupon>({
    name: '',
    code: '',
    discountType: 'percentage',
    discountValue: 0,
  });

  const updateCoupon = (newCoupon: Coupon) => {
    setNewCoupon({ ...newCoupon });
  };

  const handleAddCoupon = (onCouponAdd: (newCoupon: Coupon) => void, newCoupon: Coupon) => {
    onCouponAdd(newCoupon);
    setNewCoupon({
      name: '',
      code: '',
      discountType: 'percentage',
      discountValue: 0,
    });
  };

  return {
    newCoupon,
    updateCoupon,
    handleAddCoupon,
  };
};
