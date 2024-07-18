import { CartItem, Coupon } from '../../../types';

export const calculateItemTotal = (item: CartItem) => {
  const { product, quantity } = item;
  const { price, discounts } = product;

  const discountRateForQuantity = discounts.find((discount) => discount.quantity === quantity)?.rate ?? 0;

  return price * (1 - discountRateForQuantity) * quantity;
};

export const getMaxApplicableDiscount = (item: CartItem) => {
  const filteredItem = item.product.discounts.filter((discount) => discount.quantity === item.quantity);
  if (filteredItem.length === 0) {
    return 0;
  }

  return filteredItem.reduce((max, discount) => (discount.rate > max.rate ? discount : max), filteredItem[0]).rate;
};

export const calculateCartTotal = (cart: CartItem[], selectedCoupon: Coupon | null) => {
  const calculateDiscountCoupon = (selectedCoupon: Coupon | null) => {
    if (selectedCoupon) {
      return selectedCoupon.discountType === 'amount' ? selectedCoupon.discountValue : selectedCoupon.discountValue * 100;
    }
    return 0;
  };

  const totalBeforeDiscount = cart.reduce((total, item) => total + calculateItemTotal(item), 0);
  const totalAfterDiscount = totalBeforeDiscount - (totalBeforeDiscount * calculateDiscountCoupon(selectedCoupon));
  const totalDiscount = totalBeforeDiscount - totalAfterDiscount;

  return {
    totalBeforeDiscount,
    totalAfterDiscount,
    totalDiscount
  };
};

export const updateCartItemQuantity = (cart: CartItem[], productId: string, newQuantity: number): CartItem[] => {
  return cart.map((item) => {
    if (item.product.id === productId) {
      return {
        ...item,
        quantity: newQuantity
      };
    }
    return item;
  });
};
