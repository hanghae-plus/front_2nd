import { ReactNode, createContext, useCallback, useReducer } from "react";
import { CartItem, Coupon, Product } from "../../types";
import {
  calculateCartTotal,
  updateCartItemQuantity,
} from "../hooks/utils/cartUtils";

export interface CartContextType {
  cart: CartItem[];
  selectedCoupon: Coupon | null;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  applyCoupon: (coupon: Coupon) => void;
  calculateTotal: () => {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
    totalDiscount: number;
  };
}

type CartAction =
  | { type: "ADD_TO_CART"; payload: Product }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | {
      type: "UPDATE_QUANTITY";
      payload: { productId: string; newQuantity: number };
    }
  | { type: "APPLY_COUPON"; payload: Coupon };

interface CartState {
  cart: CartItem[];
  selectedCoupon: Coupon | null;
}

//순수함수로 구성
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_TO_CART":
      const existingItem = state.cart.find(
        (item) => item.product.id === action.payload.id
      );
      if (existingItem) {
        return {
          ...state,
          cart: updateCartItemQuantity(
            state.cart,
            action.payload.id,
            existingItem.quantity + 1
          ),
        };
      }
      return {
        ...state,
        cart: [...state.cart, { product: action.payload, quantity: 1 }],
      };
    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter((item) => item.product.id !== action.payload),
      };
    case "UPDATE_QUANTITY":
      return {
        ...state,
        cart: updateCartItemQuantity(
          state.cart,
          action.payload.productId,
          action.payload.newQuantity
        ),
      };
    case "APPLY_COUPON":
      return {
        ...state,
        selectedCoupon: action.payload,
      };
    default:
      return state;
  }
};

const initialState: CartState = {
  cart: [],
  selectedCoupon: null,
};

export const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addToCart = useCallback((product: Product) => {
    //TODO: DB 연동 시 api 붙이기
    dispatch({ type: "ADD_TO_CART", payload: product });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    //TODO: DB 연동 시 api 붙이기
    dispatch({ type: "REMOVE_FROM_CART", payload: productId });
  }, []);

  const updateQuantity = useCallback(
    //TODO: DB 연동 시 api 붙이기
    (productId: string, newQuantity: number) => {
      dispatch({
        type: "UPDATE_QUANTITY",
        payload: { productId, newQuantity },
      });
    },
    []
  );

  const applyCoupon = useCallback((coupon: Coupon) => {
    //TODO: DB 연동 시 api 붙이기
    dispatch({ type: "APPLY_COUPON", payload: coupon });
  }, []);

  const calculateTotal = useCallback(() => {
    return calculateCartTotal(state.cart, state.selectedCoupon);
  }, [state.cart, state.selectedCoupon]);

  return (
    <CartContext.Provider
      value={{
        cart: state.cart,
        selectedCoupon: state.selectedCoupon,
        addToCart,
        removeFromCart,
        updateQuantity,
        applyCoupon,
        calculateTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
