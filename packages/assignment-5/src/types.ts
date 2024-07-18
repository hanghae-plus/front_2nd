export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  discounts: Discount[];
}

export interface Discount {
  quantity: number;
  rate: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type DiscountType = "amount" | "percentage";

export interface Coupon {
  name: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
}
