import { CartItem, Coupon } from '../../../types';

export const getTotalPrice = (price, quantity, rate = 0) => {
  return price * quantity * (1 - rate);
};

export const calculateItemTotal = (item: CartItem) => {
  const product = item.product;
  const rate = getMaxApplicableDiscount(item);

  return getTotalPrice(product.price, item.quantity, rate);
};

export const getMaxApplicableDiscount = (item: CartItem) => {
  const discountInfo = item.product.discounts
    .filter((discount) => discount.quantity <= item.quantity)
    .pop();
  return discountInfo?.rate || 0;
};

export const getCouponDiscount = (selectedCoupon, afterPrice) => {
  if (selectedCoupon === null) {
    return 0;
  }

  if (selectedCoupon.discountType === 'amount') {
    return selectedCoupon.discountValue;
  }
  if (selectedCoupon.discountType === 'percentage') {
    const rate = selectedCoupon.discountValue / 100;

    return afterPrice * rate;
  }
};

export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
) => {
  const [beforePrice, afterPrice] = cart.reduce(
    ([accBeforePrice, accAfterPrice], item) => [
      accBeforePrice + getTotalPrice(item.product.price, item.quantity),
      accAfterPrice + calculateItemTotal(item),
    ],
    [0, 0]
  );
  const discount = beforePrice - afterPrice;
  const couponDiscount = getCouponDiscount(selectedCoupon, afterPrice);

  return {
    totalBeforeDiscount: Math.round(beforePrice),
    totalAfterDiscount: Math.round(afterPrice - couponDiscount),
    totalDiscount: Math.round(discount + couponDiscount),
  };
};

export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number
): CartItem[] => {
  if (newQuantity === 0) {
    return cart.filter((item) => item.product.id !== productId);
  }

  return cart.map((item) => {
    const product = item.product;

    return product.id === productId
      ? {
          ...item,
          quantity: newQuantity > product.stock ? product.stock : newQuantity,
        }
      : item;
  });
};
