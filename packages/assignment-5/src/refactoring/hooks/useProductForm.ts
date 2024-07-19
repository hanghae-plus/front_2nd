import { useCallback, useState } from 'react';

import type { Product } from '../../types';
import { createNewId } from './utils/newId.ts';

export const useProductForm = (onProductAdd: (newProduct: Product) => void) => {
  const createInitialState = () => {
    return {
      id: createNewId(),
      name: '',
      price: 0,
      stock: 0,
      discounts: [],
    };
  };

  const [newProduct, setNewProduct] = useState<Product>(createInitialState());

  const submit = useCallback(() => {
    onProductAdd(newProduct);
    setNewProduct({
      id: createNewId(),
      name: '',
      price: 0,
      stock: 0,
      discounts: [],
    });
  }, [newProduct, onProductAdd]);

  const editProperty = <K extends keyof Product>(key: K, value: Product[K]) => {
    setNewProduct({
      ...newProduct,
      [key]: value,
    });
  };

  return { newProduct, editProperty, submit };
};
