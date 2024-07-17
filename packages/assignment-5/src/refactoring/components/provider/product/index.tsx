import { createContext, ReactNode } from "react";
import { useProduct } from "hooks";
import { Product } from "types";

export const ProductContext = createContext<
  ReturnType<typeof useProduct> | undefined
>(undefined);

export const ProductProvider = ({
  initialProducts,
  children,
}: {
  initialProducts: Product[];
  children: ReactNode;
}) => {
  const products = useProduct(initialProducts);
  return (
    <ProductContext.Provider value={products}>
      {children}
    </ProductContext.Provider>
  );
};
