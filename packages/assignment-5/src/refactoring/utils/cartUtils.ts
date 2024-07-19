import { CartItem, Coupon, Product } from '@types';

export const getRemainingStock = (product: Product, cart: CartItem[]) => {
  const cartItem = cart.find((item) => item.product.id === product.id);
  return product.stock - (cartItem?.quantity || 0);
};
export const getMaxDiscount = (discounts: { quantity: number; rate: number }[]) => {
  return discounts.reduce((max, discount) => Math.max(max, discount.rate), 0);
};

export const calculateItemTotal = (item: CartItem) => {
  const { price } = item.product;
  const { quantity } = item;

  const discount = getMaxApplicableDiscount(item);

  return price * quantity * (1 - discount);
};

export const getMaxApplicableDiscount = (item: CartItem) => {
  return item.product.discounts.reduce((maxDiscount, d) => {
    return item.quantity >= d.quantity && d.rate > maxDiscount ? d.rate : maxDiscount;
  }, 0);
};

export const calculateCartTotal = (cart: CartItem[], selectedCoupon: Coupon | null) => {
  const { totalBeforeDiscount, totalAfterDiscount } = cart.reduce(
    (acc, { product, quantity }) => {
      const itemTotal = product.price * quantity;
      acc.totalBeforeDiscount += itemTotal;
      acc.totalAfterDiscount += calculateItemTotal({ product, quantity });
      return acc;
    },
    { totalBeforeDiscount: 0, totalAfterDiscount: 0 }
  );

  const discountedTotal = selectedCoupon
    ? selectedCoupon.discountType === 'amount'
      ? Math.max(0, totalAfterDiscount - selectedCoupon.discountValue)
      : totalAfterDiscount * (1 - selectedCoupon.discountValue / 100)
    : totalAfterDiscount;

  const totalDiscount = totalBeforeDiscount - discountedTotal;

  return {
    totalBeforeDiscount,
    totalAfterDiscount: discountedTotal,
    totalDiscount
  };
};
export const updateCartItemQuantity = (cart: CartItem[], productId: string, newQuantity: number): CartItem[] => {
  return cart
    .map((item) => {
      if (item.product.id === productId) {
        const maxQuantity = item.product.stock;
        const updatedQuantity = Math.max(0, Math.min(newQuantity, maxQuantity));
        return updatedQuantity > 0 ? { ...item, quantity: updatedQuantity } : null;
      }
      return item;
    })
    .filter((item): item is CartItem => item !== null);
};

export const applyCouponDiscount = (total: number, coupon: Coupon | null): number => {
  if (!coupon) return total;

  if (coupon.discountType === 'amount') {
    return Math.max(0, total - coupon.discountValue);
  } else {
    return total * (1 - coupon.discountValue / 100);
  }
};
