import { useState } from "react";
import { Product } from "../../types.ts";

export const useProducts = (initialProducts: Product[]) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const updateProduct = (productData: Product) => {
    const targetProductIndex = products.findIndex(
      ({ id }) => id === productData.id,
    );

    if (targetProductIndex !== -1) {
      // splice는 안될까?
      // setProducts((prev) => prev.splice(targetProductIndex, 1, productData));
      setProducts((prev) =>
        prev.map((item, index) =>
          index === targetProductIndex ? productData : item,
        ),
      );
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
