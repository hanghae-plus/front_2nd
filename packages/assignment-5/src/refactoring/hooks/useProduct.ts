import { useState } from "react";
import { Product } from "../../types.ts";

export const useProducts = (initialProducts: Product[]) => {
  const [products, setProducts] = useState(initialProducts);

  return {
    products,
    updateProduct: (newProduct) => {
      setProducts((prevState) =>
        prevState.map((product) => {
          return product.id === newProduct.id
            ? { ...newProduct }
            : { ...prevState };
        }),
      );
    },
    addProduct: (newProduct) => {
      setProducts((prevState) => [...prevState, newProduct]);
    },
  };
};
