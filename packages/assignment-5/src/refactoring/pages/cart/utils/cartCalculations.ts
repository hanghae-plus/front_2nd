import { CartItem, Coupon } from '../../../../types';
import { getMaxApplicableDiscount } from './discountCalculations';

export const calculateItemTotal = (item: CartItem) => {
  const { price } = item.product;
  const { quantity } = item;
  const discount = getMaxApplicableDiscount(item);
  return price * quantity * (1 - discount);
};

export const calculateCartTotal = (cart: CartItem[], selectedCoupon: Coupon | null) => {
  const totalBeforeDiscount = cart.reduce((acc, { product, quantity }) => acc + product.price * quantity, 0);

  const totalAfterDiscount = cart.reduce((acc, cartItem) => acc + calculateItemTotal(cartItem), 0);

  const finalTotal = applyCouponDiscount(totalAfterDiscount, selectedCoupon);

  const totalDiscount = totalBeforeDiscount - finalTotal;

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(finalTotal),
    totalDiscount: Math.round(totalDiscount)
  };
};

const applyCouponDiscount = (total: number, coupon: Coupon | null): number => {
  if (!coupon) return total;

  if (coupon.discountType === 'amount') {
    return Math.max(0, total - coupon.discountValue);
  } else {
    return total * (1 - coupon.discountValue / 100);
  }
};
