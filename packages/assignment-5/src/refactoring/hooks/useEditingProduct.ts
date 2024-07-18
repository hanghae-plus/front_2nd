import { useCallback, useMemo, useState } from 'react';

import type { Product } from '../../types';

export const useEditingProduct = (
  products: Product[],
  onProductUpdate: (editedProduct: Product) => void,
) => {
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [localEditingProduct, setLocalEditingProduct] = useState<
    Partial<Product>
  >({});

  const editingProduct = useMemo(() => {
    if (!editingProductId) return null;
    const productToEdit = products.find(
      (product) => product.id === editingProductId,
    );
    return productToEdit ? { ...productToEdit, ...localEditingProduct } : null;
  }, [products, editingProductId, localEditingProduct]);

  const edit = useCallback((product: Product) => {
    setEditingProductId(product.id);
    setLocalEditingProduct({});
  }, []);

  const editProperty = useCallback(
    <K extends keyof Product>(key: K, value: Product[K]) => {
      setLocalEditingProduct((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    [],
  );

  const submit = useCallback(() => {
    if (editingProduct) {
      onProductUpdate(editingProduct);
      setEditingProductId(null);
    }
  }, [editingProduct, onProductUpdate]);

  return { editingProduct, edit, editProperty, submit };
};
