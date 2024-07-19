import { createContext, ReactNode } from "react";
import { useCart } from "hooks";

export const CartContext = createContext<
  ReturnType<typeof useCart> | undefined
>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const cart = useCart();
  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>;
};
