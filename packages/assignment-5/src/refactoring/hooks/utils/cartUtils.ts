import { CartItem, Coupon } from '../../../types';

const getPrice = (price: number, quantity: number) => price * quantity;

export const calculateItemTotal = (item: CartItem) => {
  const { product, quantity } = item;
  const { price, discounts } = product;

  const discountRateForQuantity = discounts.find((discount) => discount.quantity === quantity)?.rate ?? 0;

  return getPrice(price, quantity) * (1 - discountRateForQuantity);
};

export const getMaxApplicableDiscount = (item: CartItem) => {
  const filteredItem = item.product.discounts.filter((discount) => discount.quantity === item.quantity);
  if (filteredItem.length === 0) {
    return 0;
  }

  return filteredItem.reduce((max, discount) => (discount.rate > max.rate ? discount : max), filteredItem[0]).rate;
};

const appliedDiscount = (cart: CartItem[], selectedCoupon: Coupon | null) => {
  const totalPrices = cart.reduce((total, item) => total + calculateItemTotal(item), 0);

  if (!selectedCoupon) {
    return totalPrices;
  }

  return selectedCoupon.discountType === 'amount'
    ? totalPrices - selectedCoupon.discountValue
    : totalPrices * (1 - selectedCoupon.discountValue / 100);
};

export const calculateCartTotal = (cart: CartItem[], selectedCoupon: Coupon | null) => {
  const totalBeforeDiscount = cart.reduce((total, item) => total + getPrice(item.product.price, item.quantity), 0);
  const totalAfterDiscount = appliedDiscount(cart, selectedCoupon);
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
