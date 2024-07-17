import { CartItem, Coupon } from '../../../types';

export const calculateItemTotal = (item: CartItem) => {
  const product = item.product;
  const rate = getMaxApplicableDiscount(item);

  return product.price * item.quantity * (1 - rate);
};

export const getMaxApplicableDiscount = (item: CartItem) => {
  const discountInfo = item.product.discounts
    .filter((discount) => discount.quantity <= item.quantity)
    .pop();
  return discountInfo?.rate || 0;
};

export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
) => {
  const [beforePrice, afterPrice] = cart.reduce(
    ([accBeforePrice, accAfterPrice], item) => [
      accBeforePrice + item.product.price * item.quantity,
      accAfterPrice + calculateItemTotal(item),
    ],
    [0, 0]
  );
  const discount = beforePrice - afterPrice;

  if (selectedCoupon === null) {
    return {
      totalBeforeDiscount: Math.round(beforePrice),
      totalAfterDiscount: Math.round(afterPrice),
      totalDiscount: Math.round(discount),
    };
  }

  if (selectedCoupon.discountType === 'amount') {
    const discountAmount = selectedCoupon.discountValue;

    return {
      totalBeforeDiscount: Math.round(beforePrice),
      totalAfterDiscount: Math.round(afterPrice - discountAmount),
      totalDiscount: Math.round(discount + discountAmount),
    };
  }

  if (selectedCoupon.discountType === 'percentage') {
    const rate = selectedCoupon.discountValue / 100;

    return {
      totalBeforeDiscount: Math.round(beforePrice),
      totalAfterDiscount: Math.round(afterPrice * (1 - rate)),
      totalDiscount: Math.round(beforePrice - afterPrice * (1 - rate)),
    };
  }
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
