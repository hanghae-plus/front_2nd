import { useState } from "react";
import { Product } from "../../types";

export const useNewProduct = (onProductAdd: (newProduct: Product) => void) => {
  const [showNewProductForm, setShowNewProductForm] = useState(false);

  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({
    name: "",
    price: 0,
    stock: 0,
    discounts: [],
  });

  const handleAddNewProduct = () => {
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
    setShowNewProductForm,
    setNewProduct,
    handleAddNewProduct,
  };
};
