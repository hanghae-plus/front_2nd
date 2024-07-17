import { Dispatch, SetStateAction } from "react";

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

export interface Coupon {
  name: string;
  code: string;
  discountType: "amount" | "percentage";
  discountValue: number;
}

export type setState<T> = Dispatch<SetStateAction<T>>;
export type InputEventHandler = React.ChangeEventHandler<HTMLInputElement>;
export type SelectEventHandler = React.ChangeEventHandler<HTMLSelectElement>;
