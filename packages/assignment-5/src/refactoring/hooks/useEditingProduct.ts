import { useState } from "react";
import { Product } from "../../types";

export const useEditingProduct = (
  onProductUpdate: (updatedProduct: Product) => void
) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const edit = (product: Product) => {
    setEditingProduct({ ...product });
  };

  const editProperty = <K extends keyof Product>(
    property: K,
    value: Product[K]
  ) => {
    setEditingProduct((prevProduct) => {
      if (prevProduct === null) return null;
      return { ...prevProduct, [property]: value };
    });
  };

  const submit = () => {
    if (editingProduct === null) return;
    onProductUpdate(editingProduct);
    setEditingProduct(null);
  };

  return {
    editingProduct,
    edit,
    editProperty,
    submit,
  };
};
