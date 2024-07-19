import { CartItem, Coupon, Product } from '../../../types';
import { clamp } from '../../utils/number';

export const calculateItemTotal = (item: CartItem) => {
  const { quantity } = item;
  const { price } = item.product;

  const discount = getMaxApplicableDiscount(item);

  return price * quantity * (1 - discount);
};

export const getMaxApplicableDiscount = (item: CartItem) => {
  const {
    product: { discounts },
    quantity,
  } = item;

  return discounts.reduce((maxDiscount, discount) => {
    return quantity >= discount.quantity && discount.rate > maxDiscount ? discount.rate : maxDiscount;
  }, 0);
};

export const calculateCartTotal = (cart: CartItem[], selectedCoupon: Coupon | null) => {
  const totalBeforeDiscount = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  let totalAfterDiscount = cart.reduce((total, item) => total + calculateItemTotal(item), 0);

  // 쿠폰 적용
  if (selectedCoupon) {
    if (selectedCoupon.discountType === 'amount') {
      totalAfterDiscount = Math.max(0, totalAfterDiscount - selectedCoupon.discountValue);
    } else if (selectedCoupon.discountType === 'percentage') {
      totalAfterDiscount *= 1 - selectedCoupon.discountValue / 100;
    }
  }

  const totalDiscount = totalBeforeDiscount - totalAfterDiscount;

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
    totalDiscount: Math.round(totalDiscount),
  };
};

export const updateCartItemQuantity = (cart: CartItem[], productId: string, newQuantity: number): CartItem[] => {
  return cart
    .map((item) => {
      if (item.product.id === productId) {
        const maxQuantity = item.product.stock;
        const updatedQuantity = clamp(newQuantity, 0, maxQuantity);
        return updatedQuantity > 0 ? { ...item, quantity: updatedQuantity } : null;
      }
      return item;
    })
    .filter((item): item is CartItem => item !== null);
};

export const getRemainingStock = ({ cart, product }: { cart: CartItem[]; product: Product }) => {
  const cartItem = cart.find((item) => item.product.id === product.id);

  return product.stock - (cartItem?.quantity || 0);
};
