import { useState } from "react";
import { Product } from "../../types.ts";

export const useProducts = (initialProducts: Product[]) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  /**
   * 상품을 업데이트 함수
   * @param updatedProduct
   */
  const updateProduct = (updatedProduct: Product) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  /**
   * 새로운 상품을 추가하는 함수
   * @param newProduct
   */
  const addProduct = (newProduct: Product) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  return {
    products,
    updateProduct,
    addProduct,
  };
};
