import { Product } from "@/types.ts";
import { useState } from "react";

export const useProducts = (initialProducts: Product[]) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const updateProduct = (newProduct: Product) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === newProduct.id ? newProduct : product
      )
    );
  };

  const addProduct = (newProduct: Product) => {
    setProducts((prev) => [...prev, newProduct]);
  };

  return {
    products,
    updateProduct,
    addProduct,
  };
};
