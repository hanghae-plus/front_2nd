import { Discount, Product } from './product.types';

export const INIT_NEW_PRODUCT: Omit<Product, 'id'> = {
  name: '',
  price: 0,
  stock: 0,
  discounts: [],
};

export const INIT_DISCOUNT: Omit<Discount, 'id'> = {
  quantity: 0,
  rate: 0,
};
