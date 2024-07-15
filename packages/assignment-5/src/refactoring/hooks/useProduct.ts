import { useState } from 'react';
import { Product } from '../../types.ts';

export const useProducts = (initialProducts: Product[]) => {
  const [products, setProducts] = useState(initialProducts);

  return {
    products,
    updateProduct: (newProduct) => {
      const targetIndex = products.findIndex(
        (product) => product.id === newProduct.id
      );
      const newProducts = [...products];
      newProducts.splice(targetIndex, 2, newProduct);

      setProducts(newProducts);
    },
    addProduct: (newProduct) => setProducts([...products, { ...newProduct }]),
  };
};
