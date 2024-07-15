import { useState } from "react";
import type { Product } from "types";

export const useProducts = (initialProducts: Product[]) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const updateProduct = (updatedProduct: Product) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product,
      ),
    );
  };

  const addProduct = (addedProduct: Product) => {
    setProducts([...products, addedProduct]);
  };

  return {
    products,
    updateProduct,
    addProduct,
  };
};
