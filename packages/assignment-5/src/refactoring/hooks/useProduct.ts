import { useState } from "react";
import { Product } from "../model/products/products.type";

export const useProducts = (initialProducts: Product[]) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const updateProduct = (product: Product) => {
    setProducts(
      products.map((selectedProduct) =>
        selectedProduct.id === product.id ? product : selectedProduct
      )
    );
  };

  const addProduct = (product: Product) => {
    setProducts([...products, product]);
  };

  return {
    products,
    updateProduct,
    addProduct,
  };
};
