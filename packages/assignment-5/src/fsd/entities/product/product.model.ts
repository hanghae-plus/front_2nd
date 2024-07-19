import { create } from 'zustand';
import { Product } from './product.types';
import { produce } from 'immer';
import { CartItem } from '~entities/cart';

type State = {
  products: Product[];
};

type Action = {
  setProducts: (initProducts: Product[]) => void;
  addProduct: (newProduct: Product) => void;
  updateProduct: (updatedProduct: Product) => void;
  hasRemainingStock: (targetProductId: string) => boolean;
  getRemainingStock: (targetProduct: Product, cartItems: CartItem[]) => number;
  reset: () => void;
};

const INIT_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: '상품1',
    price: 10000,
    stock: 20,
    discounts: [
      { id: 'd1', quantity: 10, rate: 0.1 },
      { id: 'd2', quantity: 20, rate: 0.2 },
    ],
  },
  {
    id: 'p2',
    name: '상품2',
    price: 20000,
    stock: 20,
    discounts: [{ id: 'd3', quantity: 10, rate: 0.15 }],
  },
  {
    id: 'p3',
    name: '상품3',
    price: 30000,
    stock: 20,
    discounts: [{ id: 'd4', quantity: 10, rate: 0.2 }],
  },
];

export const productStore = create<State & Action>((set, get) => ({
  products: INIT_PRODUCTS,

  setProducts: (initProducts) => set({ products: initProducts }),

  addProduct: (newProduct) =>
    set(
      produce((state: State) => {
        state.products.push(newProduct);
      })
    ),

  updateProduct: (updatedProduct) =>
    set(
      produce((state: State) => {
        state.products = state.products.map((product) => {
          if (product.id === updatedProduct.id) {
            return updatedProduct;
          }
          return product;
        });
      })
    ),

  hasRemainingStock: (targetProductId) => {
    const findProduct = get().products.find(
      (product) => product.id === targetProductId
    );
    return findProduct ? findProduct.stock > 0 : false;
  },

  getRemainingStock: (targetProduct, cartItems) => {
    const findCartItem = cartItems.find(
      (cartItem) => cartItem.product.id === targetProduct.id
    );
    return targetProduct.stock - (findCartItem?.quantity ?? 0);
  },

  reset: () => set({ products: [] }),
}));
