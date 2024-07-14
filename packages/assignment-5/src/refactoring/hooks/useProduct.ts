import { useCallback, useState } from 'react';

import type { Product } from '../../types.ts';

export const useProducts = (initialProducts: Product[]) => {
  const [products, setProducts] = useState<Product[]>(initialProducts ?? []);

  const updateProduct = useCallback((updateProduct: Product) => {
    setProducts((products) =>
      products.map((product) =>
        product.id === updateProduct.id ? updateProduct : product,
      ),
    );
  }, []);

  const addProduct = useCallback((newProduct: Product) => {
    setProducts((products) => [...products, newProduct]);
  }, []);

  return { products, updateProduct, addProduct };
};
