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

const calculateTotalPrice = (cart: CartItem[], calculateItem: (item: CartItem) => number) =>
  cart.reduce((total, item) => total + calculateItem(item), 0);

const appliedCoupon = (total: number, coupon: Coupon | null) => {
  if (!coupon) {
    return 0;
  }

  return coupon.discountType === 'amount' ? coupon.discountValue : total * (coupon.discountValue / 100);
};

export const calculateCartTotal = (cart: CartItem[], selectedCoupon: Coupon | null) => {
  const totalBeforeDiscount = calculateTotalPrice(cart, (item) => item.product.price * item.quantity);
  const totalPrices = calculateTotalPrice(cart, calculateItemTotal);
  const totalAfterDiscount = totalPrices - appliedCoupon(totalPrices, selectedCoupon);
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
