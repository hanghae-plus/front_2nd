import { useState } from 'react';
import { Product } from '../../types.ts';

export const useProducts = (initialProducts: Product[]) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  return {
    products,
    updateProduct: (updatedProduct: Product) => {
      setProducts((prevProducts) => prevProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
    },
    addProduct: (newProduct: Product) => {
      setProducts((prevProducts) => [...prevProducts, newProduct]);
    },
  };
};
