import { Coupon } from '../../../types';
import { useLocalStorage } from './useLocalStorage';

export function useCoupons() {
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>('coupons', []);

  const addCoupon = (product: Coupon) => {
    setCoupons((prevCoupons) => [...prevCoupons, product]);
  };

  const updateCoupon = (id: string, updatedCoupon: Coupon) => {
    setCoupons((prevCoupons) => prevCoupons.map((c) => (c.code === id ? updatedCoupon : c)));
  };

  const deleteCoupon = (id: string) => {
    setCoupons((prevCoupons) => prevCoupons.filter((c) => c.code !== id));
  };

  const getCoupon = (id: string): Coupon | undefined => {
    return coupons.find((c) => c.code === id);
  };

  return { coupons, addCoupon, updateCoupon, deleteCoupon, getCoupon };
}
