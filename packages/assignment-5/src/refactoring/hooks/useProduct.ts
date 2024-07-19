import { useCallback, useState } from 'react';

import type { Product } from '../../types';

export const useProducts = (initialProducts: Product[]) => {
  const [products, setProducts] = useState<Product[]>(initialProducts ?? []);

  const updateProduct = useCallback((updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product,
      ),
    );
  }, []);

  const addProduct = useCallback((newProduct: Product) => {
    setProducts((products) => [...products, newProduct]);
  }, []);

  return { products, updateProduct, addProduct };
};
