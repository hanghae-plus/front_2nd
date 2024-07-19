import { useStore } from 'zustand';
import { cartStore } from '~entities/cart';
import { productStore, type Product } from '~entities/product';

export const getMaxDiscount = ({ discounts }: Product) => {
  return discounts.reduce((max, discount) => Math.max(max, discount.rate), 0);
};

export const calculateRemainingStock = (product: Product) => {
  const cartItems = useStore(cartStore, (s) => s.cartItems);
  const getRemainingStock = useStore(productStore, (s) => s.getRemainingStock);
  return getRemainingStock(product, cartItems);
};
