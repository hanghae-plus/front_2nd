import { createContext } from 'react';
import { CartItem, Coupon, Product } from '../../types';

export const CartContext = createContext<{
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  applyCoupon: (coupon: Coupon) => void;
  calculateTotal: () => {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
    totalDiscount: number;
  };
  selectedCoupon: Coupon | null;
}>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  applyCoupon: () => {},
  calculateTotal: () => ({
    totalBeforeDiscount: 0,
    totalAfterDiscount: 0,
    totalDiscount: 0,
  }),
  selectedCoupon: null,
});

export const CouponsContext = createContext<{
  coupons: Coupon[];
  addCoupon: (newCoupon: Coupon) => void;
}>({ coupons: [], addCoupon: () => {} });

export const ProductsContext = createContext<{
  products: Product[];
  updateProduct: (updatedProduct: Product) => void;
  addProduct: (newProduct: Product) => void;
  deleteProduct: (product: Product) => void;
}>({
  products: [],
  updateProduct: () => {},
  addProduct: () => {},
  deleteProduct: () => {},
});
