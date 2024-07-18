import { useCallback, useState } from "react";
import { Discount, Product } from "../../types";

const useEditingProduct = (onProductUpdate: (product: Product) => void) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const edit = useCallback((product: Product) => {
    setEditingProduct(product);
  }, []);

  const editProperty = useCallback(
    <K extends keyof Product>(
      productId: string,
      property: K,
      value: Product[K]
    ) => {
      setEditingProduct((prev) => {
        if (prev && prev.id === productId) {
          return { ...prev, [property]: value };
        }
        return prev;
      });
    },
    []
  );

  const editProduct = useCallback(
    <K extends keyof Product>(
      productId: string,
      property: K,
      value: Product[K]
    ) => {
      if (property === "discounts") {
        const updatedDiscounts = value as unknown as Discount[];
        editProperty(productId, "discounts", updatedDiscounts);
      } else {
        editProperty(productId, property, value);
      }
    },
    [editProperty]
  );

  const submit = useCallback(
    (product: Product) => {
      if (product) {
        onProductUpdate(product);
        setEditingProduct(null);
      }
    },
    [onProductUpdate]
  );

  return { editProperty, edit, submit, editingProduct, editProduct };
};
export default useEditingProduct;
