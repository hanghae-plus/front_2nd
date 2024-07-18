import { useState } from 'react';

import type { Product } from '../../types';
import { createNewId } from './utils/newId.ts';

export const useProductForm = (onProductAdd: (newProduct: Product) => void) => {
  const [newProduct, setNewProduct] = useState<Product>({
    id: createNewId(),
    name: '',
    price: 0,
    stock: 0,
    discounts: [],
  });

  const submit = () => {
    onProductAdd(newProduct);
    setNewProduct({
      id: createNewId(),
      name: '',
      price: 0,
      stock: 0,
      discounts: [],
    });
  };

  const editProperty = <K extends keyof Product>(key: K, value: Product[K]) => {
    if (newProduct) {
      setNewProduct({
        ...newProduct,
        [key]: value,
      });
    }
  };

  return { newProduct, editProperty, submit };
};
