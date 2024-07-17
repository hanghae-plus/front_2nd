import { useState } from 'react';
import { Product } from '../../types.ts';

export const useProducts = (initialProducts: Product[]) => {
  const [products, setProducts] = useState<Product[]>(initialProducts || []);

  const updateProduct = (updatedProduct: Product) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
  };

  const addProduct = (newProduct: Product) => {
    setProducts((prevProduct) => [...prevProduct, newProduct]);
  };

  return {
    products,
    updateProduct,
    addProduct,
  };
};
