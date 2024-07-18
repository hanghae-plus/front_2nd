import { produce } from 'immer';
import { create } from 'zustand';
import { Product } from '~entities';
import { CartItem } from './cart.types';

const MIN_QUANTITY = 0;

type State = {
  cartItems: CartItem[];
};

type Action = {
  setCarts: (initCartItems: CartItem[]) => void;
  addToCart: (newProduct: Product) => void;
  removeFromCart: (targetProductId: string) => void;
  updateQuantity: (targetProductId: string, newQuantity: number) => void;
  reset: () => void;
};

export const cartStore = create<State & Action>()((set) => ({
  cartItems: [],

  setCarts: (initCartItems) => set({ cartItems: initCartItems }),

  addToCart: (newProduct: Product) =>
    set(
      produce((state: State) => {
        const existingCartItem = state.cartItems.find(
          (cartItem) => cartItem.product.id === newProduct.id
        );
        if (existingCartItem) {
          existingCartItem.quantity += 1;
        } else {
          state.cartItems.push({ product: newProduct, quantity: 1 });
        }
      })
    ),

  removeFromCart: (targetProductId: string) =>
    set(
      produce((state: State) => {
        state.cartItems = state.cartItems.filter(
          (cartItem) => cartItem.product.id !== targetProductId
        );
      })
    ),

  updateQuantity: (targetProductId: string, newQuantity: number) =>
    set(
      produce((state: State) => {
        if (newQuantity <= 0) {
          state.cartItems = state.cartItems.filter(
            (cartItem) => cartItem.product.id !== targetProductId
          );
        }

        const cartItem = state.cartItems.find(
          (cartItem) => cartItem.product.id === targetProductId
        );

        if (cartItem) {
          let validNewQuantity = Math.max(MIN_QUANTITY, newQuantity);
          validNewQuantity = Math.min(cartItem.product.stock, validNewQuantity);
          cartItem.quantity = validNewQuantity;
        }
      })
    ),

  reset: () => set({ cartItems: [] }),
}));
