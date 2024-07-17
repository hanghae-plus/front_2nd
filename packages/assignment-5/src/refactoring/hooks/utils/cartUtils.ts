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
  return {
    totalBeforeDiscount: 0,
    totalAfterDiscount: 0,
    totalDiscount: 0
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
