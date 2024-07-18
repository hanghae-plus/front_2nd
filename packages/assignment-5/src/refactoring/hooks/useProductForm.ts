import { useState } from "react";
import { Product } from "../../types.ts";

const initialState = {
  name: "",
  price: 0,
  stock: 0,
  discounts: [],
};

export const useProductForm = () => {
  const [productForm, setProductForm] =
    useState<Omit<Product, "id">>(initialState);

  const updateProductFormField = <F extends keyof Product>(
    field: F,
    value: Product[F],
  ) => {
    setProductForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetProductForm = () => {
    setProductForm(initialState);
  };

  return {
    productForm,
    updateProductFormField,
    resetProductForm,
  };
};
