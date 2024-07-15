import { Product } from "../../../../types.ts";
import { useState } from "react";
import { createEmptyProduct } from "../utils";

export const useProductForm = (onProductAdd: (newProduct: Product) => void) => {
  const [enable, setEnable] = useState(false);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>(createEmptyProduct());

  const submit = () => {
    const productWithId = { ...newProduct, id: Date.now().toString() };
    onProductAdd(productWithId);
    setNewProduct(createEmptyProduct());
    setEnable(false);
  };

  const toggle = () => setEnable(!enable)

  return { enable, newProduct, setNewProduct, toggle, submit };
};
