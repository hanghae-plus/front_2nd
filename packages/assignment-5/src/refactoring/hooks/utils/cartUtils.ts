import { CartItem, Coupon } from '../../../types';

export const calculateItemTotal = (item: CartItem) => {
  const { product, quantity } = item;
  const { price } = product;

  const maxDiscountRate = getMaxApplicableDiscount(item);

  return price * quantity * (1 - maxDiscountRate);
};

export const getMaxApplicableDiscount = (item: CartItem) => {
  return item.product.discounts
    .filter((discount) => item.quantity >= discount.quantity)
    .reduce((maxRate, discount) => Math.max(maxRate, discount.rate), 0);
};

const appliedCoupon = (cart: CartItem[], selectedCoupon: Coupon | null) => {
  const totalPrices = cart.reduce((total, item) => total + calculateItemTotal(item), 0);

  if (!selectedCoupon) {
    return totalPrices;
  }

  return selectedCoupon.discountType === 'amount'
    ? totalPrices - selectedCoupon.discountValue
    : totalPrices * (1 - selectedCoupon.discountValue / 100);
};

export const calculateCartTotal = (cart: CartItem[], selectedCoupon: Coupon | null) => {
  const totalBeforeDiscount = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const totalAfterDiscount = appliedCoupon(cart, selectedCoupon);
  const totalDiscount = totalBeforeDiscount - totalAfterDiscount;

  return {
    totalBeforeDiscount,
    totalAfterDiscount,
    totalDiscount
  };
};

export const updateCartItemQuantity = (cart: CartItem[], productId: string, newQuantity: number): CartItem[] => {
  if (newQuantity === 0) {
    return cart.filter((item) => item.product.id !== productId);
  }

  return cart.map((item) => {
    if (item.product.id === productId) {
      return {
        ...item,
        quantity: newQuantity > item.product.stock ? item.product.stock : newQuantity
      };
    }
    return item;
  });
};
