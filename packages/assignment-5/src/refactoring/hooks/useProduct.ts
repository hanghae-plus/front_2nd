import { useState } from 'react';
import { Product } from '../../types.ts';

export const useProducts = (initialProducts: Product[]) => {
  const [products, setProducts] = useState(initialProducts);

  const updateProduct = (newProduct) => {
    const targetIndex = products.findIndex(
      (product) => product.id === newProduct.id
    );
    const newProducts = [...products];
    newProducts.splice(targetIndex, 2, newProduct);

    setProducts(newProducts);
  };

  const addProduct = (newProduct) =>
    setProducts([...products, { ...newProduct }]);

  return {
    products,
    updateProduct,
    addProduct,
  };
};
