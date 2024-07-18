import { Product } from '~entities/product/product.types';

export interface CartItem {
  product: Product;
  quantity: number;
}
