// // store/couponStore.ts
// import create from 'zustand';
// import { Coupon } from '../../types';

// const initialCoupons: Coupon[] = [
//   {
//     name: '5000원 할인 쿠폰',
//     code: 'AMOUNT5000',
//     discountType: 'amount',
//     discountValue: 5000
//   },
//   {
//     name: '10% 할인 쿠폰',
//     code: 'PERCENT10',
//     discountType: 'percentage',
//     discountValue: 10
//   }
// ];

// // 스토어 생성
// export const useCouponStore = create<CartStore>((set) => ({
//   coupon: initialCoupons
// }));
