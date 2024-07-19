// // store/cartStore.ts
// import create from 'zustand';
// import { Product, CartItem } from '../../types';
// interface CartItem {
//   product: Product;
//   quantity: number;
// }

// // 스토어 타입 정의
// type CartStore = {
//   cart: CartItem[];
//   updateCartItemQuantity: (productId: string, quantity: number) => void;
//   addCartItem: (product: Product) => void;
//   removeCartItem: (productId: string) => void;
// };

// // 스토어 생성
// export const useCartStore = create<CartStore>((set) => ({
//   cart: []
// }));
