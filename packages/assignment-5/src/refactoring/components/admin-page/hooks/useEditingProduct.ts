import { Product } from "../../../../types.ts";
import { useState } from "react";

export const useEditingProduct = (onProductUpdate: (updatedProduct: Product) => void) => {
  const [value, setValue] = useState<Product | null>(null);

  const edit = (product: Product) => {
    setValue({ ...product });
  };

  function editProperty<K extends keyof Product, V extends Product[K]>(field: K, newValue: V) {
    if (value) {
      const updatedProduct = { ...value, [field]: newValue };
      setValue(updatedProduct);
    }
  }

  const submit = () => {
    if (value) {
      onProductUpdate(value);
      setValue(null);
    }
  };

  return { value, edit, editProperty, submit };
};
