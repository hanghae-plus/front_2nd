import { InputEventHandler, Product } from "@/types";
import { useState } from "react";

const useEditProductInform = (initProduct: Product) => {
  const [editingProduct, setEditingProduct] = useState<Product>({
    ...initProduct,
  });

  const onChangeName: InputEventHandler = (event) => {
    const updatedProduct = { ...editingProduct, name: event.target.value };
    setEditingProduct(updatedProduct);
  };

  const onChangePrice: InputEventHandler = (event) => {
    const updatedProduct = {
      ...editingProduct,
      price: parseInt(event.target.value),
    };
    setEditingProduct(updatedProduct);
  };

  const onChangeStock: InputEventHandler = (event) => {
    const updatedProduct = {
      ...editingProduct,
      stock: parseInt(event.target.value),
    };
    setEditingProduct(updatedProduct);
  };

  return {
    onChangeName,
    onChangePrice,
    onChangeStock,
    editingProduct,
    setEditingProduct,
  };
};

export default useEditProductInform;
