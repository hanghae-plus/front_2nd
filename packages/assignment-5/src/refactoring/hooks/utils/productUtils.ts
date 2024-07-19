import { Product } from '../../../types';

export const replaceUpdatedProduct = (
  products: Product[],
  item: Product,
  index: number
) => {
  return [...products.slice(0, index), item, ...products.slice(index + 1)];
};
