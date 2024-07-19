import { CartItem, Coupon } from '../../../types';
import { clamp } from '../../utils/clamp';

export const calculateItemTotal = (item: CartItem) => {
  const { product, quantity } = item;
  const maxDiscountRate = getMaxApplicableDiscount(item);

  return product.price * quantity * (1 - maxDiscountRate);
};

export const getMaxApplicableDiscount = (item: CartItem) => {
  const { product, quantity } = item;

  return product.discounts.reduce((acc, discount) => (quantity >= discount.quantity ? discount.rate : acc), 0);
};

export const calculateCartTotal = (cart: CartItem[], selectedCoupon: Coupon | null) => {
  const totalBeforeDiscount = cart.reduce((acc, item) => acc + item.quantity * item.product.price, 0);

  let totalAfterDiscount = cart.reduce((acc, item) => acc + calculateItemTotal(item), 0);
  if (selectedCoupon && selectedCoupon.discountType === 'percentage') {
    totalAfterDiscount = totalAfterDiscount * (1 - selectedCoupon.discountValue / 100);
  }

  if (selectedCoupon && selectedCoupon.discountType === 'amount') {
    totalAfterDiscount = Math.max(totalAfterDiscount - selectedCoupon.discountValue, 0);
  }

  return {
    totalBeforeDiscount: totalBeforeDiscount,
    totalAfterDiscount: totalAfterDiscount,
    totalDiscount: totalBeforeDiscount - totalAfterDiscount
  };
};

export const updateCartItemQuantity = (cart: CartItem[], productId: string, newQuantity: number): CartItem[] => {
  return cart
    .map((item) => {
      if (item.product.id === productId) {
        const maxQuantity = item.product.stock;
        const updatedQuantity = clamp(newQuantity, 0, maxQuantity);

        return updatedQuantity > 0 && { ...item, quantity: updatedQuantity };
      }

      return item;
    })
    .filter((item): item is CartItem => Boolean(item));
};
