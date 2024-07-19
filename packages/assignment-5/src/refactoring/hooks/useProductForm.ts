import { useState } from "react";
import { Product } from "../../types";

export const useProductForm = (onProductAdd: (newProduct: Product) => void) => {
  const [showNewProductForm, setShowNewProductForm] = useState(false);
  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({
    name: "",
    price: 0,
    stock: 0,
    discounts: [],
  });

  const toggle = () => setShowNewProductForm(!showNewProductForm);

  const setNewProductProperty = <K extends keyof Omit<Product, "id">>(
    key: K,
    value: Omit<Product, "id">[K]
  ) => {
    setNewProduct({ ...newProduct, [key]: value });
  };

  const submit = () => {
    const productWithId = { ...newProduct, id: Date.now().toString() };
    onProductAdd(productWithId);
    setNewProduct({
      name: "",
      price: 0,
      stock: 0,
      discounts: [],
    });
    setShowNewProductForm(false);
  };

  return {
    showNewProductForm,
    newProduct,
    toggle,
    setNewProductProperty,
    submit,
  };
};
