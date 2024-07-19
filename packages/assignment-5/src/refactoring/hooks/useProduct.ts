import { useState } from "react";
import { Product } from "../../types.ts";

export const useProducts = (initialProducts: Product[]) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const updateProduct = (nowProduct: Product) => {
    setProducts((prev) =>
      prev.map((item: Product) =>
        item.id === nowProduct.id ? nowProduct : item
      )
    );
  };

  const addProduct = (newProduct: Product) => {
    setProducts((prev) => [...prev, newProduct]);
  };

  return {
    products: products,
    updateProduct: updateProduct,
    addProduct: addProduct,
  };
};
