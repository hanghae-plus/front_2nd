import { CartItem as TCartItem, Product } from "../../../../types.ts";


export const getMaxDiscount = (discounts: { quantity: number; rate: number }[]): number => {
  return discounts.reduce((max, discount) => Math.max(max, discount.rate), 0);
};

export const getRemainingStock = (product: Product, cart: TCartItem[]): number => {
  const cartItem = cart.find(item => item.product.id === product.id);
  return product.stock - (cartItem?.quantity || 0);
};

export const getAppliedDiscount = (item: TCartItem): number => {
  const { discounts } = item.product;
  const { quantity } = item;
  return discounts.reduce((maxDiscount, discount) =>
    quantity >= discount.quantity ? Math.max(maxDiscount, discount.rate) : maxDiscount, 0);
};
