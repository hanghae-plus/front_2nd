import { useState } from 'react';

import { Product } from '../types';

export const useProducts = (initialProducts: Product[]) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const addProduct = (newProduct: Product) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  const removeProduct = (productId: string) => {
    setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId));
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => (product.id === updatedProduct.id ? updatedProduct : product))
    );
  };
  return { products, addProduct, removeProduct, updateProduct };
};
