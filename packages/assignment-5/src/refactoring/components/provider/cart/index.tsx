import React, { createContext, ReactNode } from "react";
import { useCart } from "hooks";

export const CartContext = createContext<
  ReturnType<typeof useCart> | undefined
>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const cart = useCart();
  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>;
};
