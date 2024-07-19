import { useState } from 'react';
import { Product } from '../../types.ts';
import { replaceUpdatedProduct } from './utils/productUtils.ts';

export const useProducts = (initialProducts: Product[]) => {
  const [products, setProducts] = useState(initialProducts);

  const updateProduct = (updatedProduct: Product, index = 0) => {
    setProducts((prevProd) =>
      replaceUpdatedProduct(prevProd, updatedProduct, index)
    );
  };

  const addProduct = (newProduct: Product) => {
    setProducts((prevProd) => [...prevProd, newProduct]);
  };

  return { products, updateProduct, addProduct };
};
