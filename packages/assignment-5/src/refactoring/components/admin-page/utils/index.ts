import { Coupon, Product } from "../../../../types.ts";

export const createEmptyProduct = (): Omit<Product, 'id'> => ({
  name: '',
  price: 0,
  stock: 0,
  discounts: []
});

export const createEmptyCoupon = (): Coupon => ({
  name: '',
  code: '',
  discountType: 'percentage',
  discountValue: 0
});
