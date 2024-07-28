import { Product } from "@/types.ts";
import { useEffect, useState } from "react";
import apis from "../apis";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);

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

  const initialize = () => {
    apis.getProducts().then(setProducts);
  };
  useEffect(initialize, []);

  return {
    products,
    updateProduct,
    addProduct,
  };
};
