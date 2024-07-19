import { useCallback, useState } from 'react';

import type { Coupon } from '../../types';

export const useCoupons = (initialCoupons: Coupon[]) => {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons ?? []);

  const addCoupon = useCallback((newCoupon: Coupon) => {
    setCoupons((coupons) => [...coupons, newCoupon]);
  }, []);

  return { coupons, addCoupon };
};
