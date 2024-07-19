import { useState } from "react";
import { Product } from "../../types.ts";

export const useProducts = (initialProducts: Product[]) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const updateProduct = (product: Product) => {
    if (product.id) {
      const updateProducts = products.map((value) => {
        if (value.id === product.id) {
          return product;
        }
        return value;
      });

      setProducts([...updateProducts]);
    }
  };

  const addProduct = (product: Product) => {
    setProducts((prev) => [...prev, product]);
  };

  return {
    products,
    updateProduct,
    addProduct,
  };
};
