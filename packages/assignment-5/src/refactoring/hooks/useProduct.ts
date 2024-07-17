import { useState } from "react";
import { Product } from "../../types.ts";

export const useProducts = (initialProducts: Product[]) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const updateProduct = (updateProduct: Product) => {
    setProducts(
      products.map((product) =>
        product.id === updateProduct.id ? updateProduct : product
      )
    );
  };

  const addProduct = (newProducts: Product) => {
    setProducts([...products, newProducts]);
  };

  return { products, updateProduct, addProduct };
};
