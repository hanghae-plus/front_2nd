import {
  createContext,
  ReactNode,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { useProduct } from "hooks";
import { Product } from "types";

// useProduct의 반환 타입 정의
type UseProductReturn = ReturnType<typeof useProduct>;

// ProductContextValue 타입 정의
type ProductContextValue = UseProductReturn & {
  editingProduct: Product | null;
  setEditingProduct: Dispatch<SetStateAction<Product | null>>;
};

// ProductProviderProps 타입 정의
type ProductProviderProps = {
  initialProducts: Product[];
  children: ReactNode;
};

export const ProductContext = createContext<ProductContextValue | undefined>(
  undefined,
);

export const ProductProvider = ({
  initialProducts,
  children,
}: ProductProviderProps) => {
  const products = useProduct(initialProducts);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const contextValue: ProductContextValue = {
    ...products,
    editingProduct,
    setEditingProduct,
  };

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
};
