import { useState } from 'react';
import { Product } from '../../types.ts';

export const useProducts = (initialProducts: Product[]) => {
  const [products, setProducts] = useState(initialProducts)

  const updateProduct = () => {}

  const addProduct = () => {}
  
  return { products, updateProduct, addProduct };
};
