import { CartItem } from '~entities/cart';

export const calculateAppliedDiscount = (cartItem: CartItem) => {
  const { discounts } = cartItem.product;
  const { quantity } = cartItem;

  let appliedDiscount = 0;
  for (const discount of discounts) {
    if (quantity >= discount.quantity) {
      appliedDiscount = Math.max(appliedDiscount, discount.rate);
    }
  }
  return appliedDiscount;
};
