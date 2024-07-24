import { produce } from 'immer';
import { create } from 'zustand';
import { type Coupon } from '~entities/coupon';

export const INIT_COUPONS: Coupon[] = [
  {
    name: '5000원 할인 쿠폰',
    code: 'AMOUNT5000',
    discountType: 'amount',
    discountValue: 5000,
  },
  {
    name: '10% 할인 쿠폰',
    code: 'PERCENT10',
    discountType: 'percentage',
    discountValue: 10,
  },
];

type State = {
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
};

type Action = {
  setCoupons: (initCoupons: Coupon[]) => void;
  addCoupon: (newCoupon: Coupon) => void;
  applyCoupon: (selectedCoupon: Coupon) => void;
  reset: () => void;
};

export const couponStore = create<State & Action>((set) => ({
  coupons: INIT_COUPONS,
  selectedCoupon: null,

  setCoupons: (initCoupons) => set({ coupons: initCoupons }),

  addCoupon: (newCoupon) =>
    set(
      produce((state: State) => {
        state.coupons.push(newCoupon);
      })
    ),

  applyCoupon: (selectedCoupon) =>
    set(
      produce((state: State) => {
        state.selectedCoupon = selectedCoupon;
      })
    ),

  reset: () => set({ coupons: [], selectedCoupon: null }),
}));
