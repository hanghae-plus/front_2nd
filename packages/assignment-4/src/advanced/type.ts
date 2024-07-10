const MAX_QUANTITY = 999;
const MIN_QUANTITY = 0;

export class CartItem {
  product: Product;
  quantity: number;

  constructor(product: Product, quantity: number = 1) {
    this.product = product;
    this.quantity = quantity;
  }

  increaseQuantity(quantity: number) {
    this.quantity = Math.min(this.quantity + quantity, MAX_QUANTITY);
  }

  decreaseQuantity(quantity: number) {
    this.quantity = Math.max(this.quantity - quantity, MIN_QUANTITY);
  }

  equals(product: Product) {
    return this.product.id === product.id;
  }
}

export interface Product {
  id: string;
  name: string;
  price: number;
}

export interface DiscountDetail {
  total: number;
  discountRate: number;
}
