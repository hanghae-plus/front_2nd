import { useState } from 'react';
import { Product } from '../../types';

export const useProducts = (initialProducts: Product[]) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const addProduct = (product: Product) => {
    setProducts(prevProducts => [...prevProducts, product]);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prevProducts => prevProducts.map(product =>
      product.id === updatedProduct.id ? updatedProduct : product
    ));
  };

  return {
    products,
    addProduct,
    updateProduct,
  };
};
