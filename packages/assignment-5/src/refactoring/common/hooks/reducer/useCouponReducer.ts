import { useReducer } from 'react';

import { Coupon } from '../../models';

interface CouponAction {
  type: 'ADD_COUPON' | 'REMOVE_COUPON' | 'UPDATE_COUPON';
  payload: Coupon;
}

const initialCoupons: Coupon[] = [
  {
    name: '5000원 할인 쿠폰',
    code: 'AMOUNT5000',
    discountType: 'amount',
    discountValue: 5000
  },
  {
    name: '10% 할인 쿠폰',
    code: 'PERCENT10',
    discountType: 'percentage',
    discountValue: 10
  }
];

const couponReducer = (state: Coupon[], action: CouponAction) => {
  switch (action.type) {
    case 'ADD_COUPON':
      return [...state, action.payload];
    case 'REMOVE_COUPON':
      return state.filter((coupon) => coupon.code !== action.payload.code);
    case 'UPDATE_COUPON':
      return state.map((coupon) => (coupon.code === action.payload.code ? action.payload : coupon));
    default:
      return state;
  }
};

export const useCouponReducer = () => {
  const [coupons, dispatch] = useReducer(couponReducer, initialCoupons);

  const addCoupon = (newCoupon: Coupon) => {
    dispatch({ type: 'ADD_COUPON', payload: newCoupon });
  };

  const removeCoupon = (coupon: Coupon) => {
    dispatch({ type: 'REMOVE_COUPON', payload: coupon });
  };

  const updateCoupon = (coupon: Coupon) => {
    dispatch({ type: 'UPDATE_COUPON', payload: coupon });
  };

  return { coupons, addCoupon, removeCoupon, updateCoupon };
};
