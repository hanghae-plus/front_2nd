import { InputEventHandler, Product, ProductForm } from "@/types";
import { useState } from "react";
import generateErrorMessage from "../utils/generateErrorMessage";
import { VALIDATION_CONDITIONS } from "../utils/validation";
import useFormValidation from "./useFormValidation";

const useProductForm = (
  initProduct: Product,
  callback: (product: Product) => void
) => {
  const [editingProduct, setEditingProduct] = useState<Product>(initProduct);
  const [productForm, setProductForm] = useState<ProductForm>({
    name: editingProduct.name,
    price: `${editingProduct.price ? editingProduct.price : ""}`,
    stock: `${editingProduct.stock ? editingProduct.stock : ""}`,
  });

  const [isValidName] = useFormValidation(
    VALIDATION_CONDITIONS.isNotEmpty,
    productForm.name
  );
  const [isValidPrice] = useFormValidation(
    VALIDATION_CONDITIONS.isPositiveNumber,
    productForm.price.toString()
  );
  const [isValidStock] = useFormValidation(
    VALIDATION_CONDITIONS.isPositiveNumber,
    productForm.stock.toString()
  );
  const [errorMessage, setErrorMessage] = useState<string>("");

  const onChangeName: InputEventHandler = (event) =>
    setProductForm((prev) => ({ ...prev, name: event.target.value }));

  const onChangeStock: InputEventHandler = (event) =>
    setProductForm((prev) => ({
      ...prev,
      stock: event.target.value,
    }));

  const onChangePrice: InputEventHandler = (event) =>
    setProductForm((prev) => ({
      ...prev,
      price: event.target.value,
    }));

  const submitEditingProduct = () => {
    if (!isValidName) {
      setErrorMessage(generateErrorMessage.formError("상품명"));

      return;
    }
    if (!isValidPrice) {
      setErrorMessage(generateErrorMessage.formError("상품 가격", "0 이상의"));

      return;
    }
    if (!isValidStock) {
      setErrorMessage(generateErrorMessage.formError("상품 재고", "0 이상의"));

      return;
    }

    const newProduct = {
      ...editingProduct,
      name: productForm.name,
      price: parseInt(productForm.price),
      stock: parseInt(productForm.stock),
    };
    callback(newProduct);
    setErrorMessage("");
  };

  return {
    editingProduct,
    productForm,
    onChangeName,
    onChangePrice,
    onChangeStock,
    setEditingProduct,
    submitEditingProduct,
    errorMessage,
  };
};

export default useProductForm;
