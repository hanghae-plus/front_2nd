import { useState } from 'react';

import { Product } from '../../types.ts';

export const useProducts = (initialProducts: Product[]) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const updateProduct = (updatedProduct: Product) => {
    return setProducts((prevProducts) => prevProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
  };

  const addProduct = (newProduct: Product) => {
    return setProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  return {
    products,
    updateProduct,
    addProduct,
  };
};
