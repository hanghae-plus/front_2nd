import { useState, useCallback } from "react";
import { Product } from "../../types";
import useToggle from "./utils/common/useToggle";

type NewProduct = Omit<Product, "id">;

const initialProductState: NewProduct = {
  name: "",
  price: 0,
  stock: 0,
  discounts: [],
};

export const useProductForm = (onProductAdd: (newProduct: Product) => void) => {
  const {
    isShow: showNewProductForm,
    toggle: toggleProductForm,
    close: closeProductForm,
  } = useToggle();

  const [newProduct, setNewProduct] = useState<NewProduct>(initialProductState);

  const updateNewProduct = useCallback((update: Partial<NewProduct>) => {
    setNewProduct((prev) => ({ ...prev, ...update }));
  }, []);

  const submit = useCallback(() => {
    const productWithId: Product = { ...newProduct, id: Date.now().toString() };
    onProductAdd(productWithId);
    setNewProduct(initialProductState);
  }, [newProduct, onProductAdd]);

  const addNewProduct = useCallback(() => {
    submit();
    closeProductForm();
  }, [submit]);

  return {
    newProduct,
    setNewProduct: updateNewProduct,
    submit,
    showNewProductForm,
    addNewProduct,
    toggleProductForm,
  };
};
