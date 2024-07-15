import { CartItem, Coupon } from "../../../../types.ts";

export const calculateItemTotal = (item: CartItem): number => {
  const { price } = item.product;
  const { quantity } = item;
  const discount = getMaxApplicableDiscount(item);
  return price * quantity * (1 - discount);
};

export const getMaxApplicableDiscount = (item: CartItem): number => {
  return item.product.discounts.reduce((maxDiscount, d) => {
    return item.quantity >= d.quantity && d.rate > maxDiscount ? d.rate : maxDiscount;
  }, 0);
};

export const calculateCartTotal = (cart: CartItem[], selectedCoupon: Coupon | null): {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
  totalDiscount: number;
} => {
  let totalBeforeDiscount = 0;
  let totalAfterDiscount = 0;

  cart.forEach(item => {
    const itemTotal = item.product.price * item.quantity;
    totalBeforeDiscount += itemTotal;
    totalAfterDiscount += calculateItemTotal(item);
  });

  let totalDiscount = totalBeforeDiscount - totalAfterDiscount;

  if (selectedCoupon) {
    if (selectedCoupon.discountType === 'amount') {
      totalAfterDiscount = Math.max(0, totalAfterDiscount - selectedCoupon.discountValue);
    } else {
      totalAfterDiscount *= (1 - selectedCoupon.discountValue / 100);
    }
    totalDiscount = totalBeforeDiscount - totalAfterDiscount;
  }

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
    totalDiscount: Math.round(totalDiscount)
  };
};

export const updateCartItemQuantity = (cart: CartItem[], productId: string, newQuantity: number): CartItem[] => {
  return cart.map(item => {
    if (item.product.id === productId) {
      const maxQuantity = item.product.stock;
      const updatedQuantity = Math.max(0, Math.min(newQuantity, maxQuantity));
      return updatedQuantity > 0 ? { ...item, quantity: updatedQuantity } : null;
    }
    return item;
  }).filter((item): item is CartItem => item !== null);
};


