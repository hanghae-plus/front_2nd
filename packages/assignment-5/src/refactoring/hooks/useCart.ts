import { useContext } from "react";
import { CartContext, CartContextType } from "../store/cartContext";

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === null) {
    throw new Error("useCart는 CartProvider 안에서 사용해야 합니다.");
  }
  return context;
};
