import { useState } from 'react';

import { useCouponReducer } from '../../../../common/hooks/reducer/useCouponReducer';
import { Coupon } from '../../../../common/models';

export const useCouponAdmin = () => {
  const { coupons, addCoupon } = useCouponReducer();
  const [newCoupon, setNewCoupon] = useState<Coupon>({
    name: '',
    code: '',
    discountType: 'percentage',
    discountValue: 0
  });

  const handleChangeCoupon = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => (key: string) => {
    const changedValue = e.target.value;

    setNewCoupon({ ...newCoupon, [key]: typeof changedValue === 'number' ? parseFloat(changedValue) : changedValue });
  };

  const handleAddCoupon = () => {
    addCoupon(newCoupon);
    setNewCoupon({
      name: '',
      code: '',
      discountType: 'percentage',
      discountValue: 0
    });
  };
  return { coupons, newCoupon, handleChangeCoupon, handleAddCoupon };
};
