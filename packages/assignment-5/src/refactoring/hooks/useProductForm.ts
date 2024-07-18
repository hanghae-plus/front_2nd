import { useCallback, useState } from 'react';
import type { Product } from '../../types';

export const useProductForm = (onProductAdd: (newProduct: Product) => void) => {
  const [newProduct, setNewProduct] = useState<Product>({
    id: Date.now().toString(),
    name: '',
    price: 0,
    stock: 0,
    discounts: [],
  });

  const submit = useCallback(() => {
    onProductAdd(newProduct);
    setNewProduct({
      id: Date.now().toString(),
      name: '',
      price: 0,
      stock: 0,
      discounts: [],
    });
  }, [newProduct, onProductAdd]);

  const editProperty = useCallback(
    <K extends keyof Product>(key: K, value: Product[K]) => {
      if (newProduct) {
        setNewProduct({
          ...newProduct,
          [key]: value,
        });
      }
    },
    [newProduct],
  );

  return { newProduct, editProperty, submit };
};