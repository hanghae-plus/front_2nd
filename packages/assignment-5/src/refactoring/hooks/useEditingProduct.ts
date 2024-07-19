import { useState } from "react";
import { Product } from "../../types.ts";

export const useEditingProduct = (initialProduct: Product) => {
  const [editingProduct, setEditingProduct] = useState(initialProduct);

  const updateEditingProduct = <F extends keyof Product>(
    field: F,
    value: Product[F],
  ) => {
    setEditingProduct((prev) => ({ ...prev, [field]: value }));
  };

  return {
    editingProduct,
    updateEditingProduct,
  };
};
