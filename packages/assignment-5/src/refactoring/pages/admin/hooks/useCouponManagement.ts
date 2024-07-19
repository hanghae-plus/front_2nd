import { useState, useCallback } from 'react';
import { Coupon } from '../../../../types';
import { useCoupons } from '../../../common/hooks';

export const useCouponManagement = () => {
  const { coupons, addCoupon } = useCoupons();
  const [newCoupon, setNewCoupon] = useState<Coupon>({
    name: '',
    code: '',
    discountType: 'percentage',
    discountValue: 0
  });

  const handleAddCoupon = useCallback(() => {
    addCoupon(newCoupon);
    setNewCoupon({
      name: '',
      code: '',
      discountType: 'percentage',
      discountValue: 0
    });
  }, [newCoupon, addCoupon]);

  return {
    coupons,
    newCoupon,
    setNewCoupon,
    handleAddCoupon
  };
};
