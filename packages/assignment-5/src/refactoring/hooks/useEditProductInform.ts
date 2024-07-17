import { InputEventHandler, Product } from "@/types";
import { useState } from "react";

const useEditProductInform = (initProduct: Product) => {
  const [editingProduct, setEditingProduct] = useState<Product>({
    ...initProduct,
  });

  const onChangeName: InputEventHandler = (event) =>
    setEditingProduct((prev) => ({ ...prev, name: event.target.value }));

  const onChangeStock: InputEventHandler = (event) =>
    setEditingProduct((prev) => ({
      ...prev,
      stock: parseInt(event.target.value),
    }));

  const onChangePrice: InputEventHandler = (event) =>
    setEditingProduct((prev) => ({
      ...prev,
      price: parseInt(event.target.value),
    }));

  return {
    onChangeName,
    onChangePrice,
    onChangeStock,
    editingProduct,
    setEditingProduct,
  };
};

export default useEditProductInform;
