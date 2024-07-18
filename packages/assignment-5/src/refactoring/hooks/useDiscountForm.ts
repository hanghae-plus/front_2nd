import { DiscountForm, InputEventHandler, Product } from "@/types";
import { useState } from "react";
import generateErrorMessage from "../utils/generateErrorMessage";
import { VALIDATION_CONDITIONS } from "../utils/validation";
import useFormValidation from "./useFormValidation";
import useProductForm from "./useProductForm";

const useDiscountForm = (
  productForm: ReturnType<typeof useProductForm>,
  onProductUpdate: (updatedProduct: Product) => void
) => {
  const [discountForm, setDiscountForm] = useState<DiscountForm>({
    quantity: "",
    rate: "",
  });

  const [isValidRate] = useFormValidation(
    VALIDATION_CONDITIONS.isRate,
    discountForm.rate
  );
  const [isValidQuantity] = useFormValidation(
    VALIDATION_CONDITIONS.isPositiveNumber,
    discountForm.quantity
  );
  const [errorMessage, setErrorMessage] = useState<string>("");

  const onChangeDiscountQuantity: InputEventHandler = (event) =>
    setDiscountForm((prev) => ({
      ...prev,
      quantity: event.target.value,
    }));

  const onChangeDiscountRate: InputEventHandler = (event) =>
    setDiscountForm((prev) => ({
      ...prev,
      rate: event.target.value,
    }));

  const onClickRemoveDiscount = (index: number) => {
    const updatedProduct = {
      ...productForm.editingProduct,
      discounts: productForm.editingProduct.discounts.filter(
        (_, i) => i !== index
      ),
    };
    onProductUpdate(updatedProduct);
    productForm.setEditingProduct(updatedProduct);
  };

  const onClickAddDiscount = () => {
    if (!isValidQuantity) {
      setErrorMessage(generateErrorMessage.formError("할인 수량", "0 이상의"));

      return;
    }
    if (!isValidRate) {
      setErrorMessage(
        generateErrorMessage.formError("할인율", "0 이상 100 이하의")
      );

      return;
    }

    const validDiscount = {
      quantity: parseInt(discountForm.quantity),
      rate: parseInt(discountForm.rate) / 100,
    };
    const updatedProduct = {
      ...productForm.editingProduct,
      discounts: [...productForm.editingProduct.discounts, validDiscount],
    };
    onProductUpdate(updatedProduct);
    productForm.setEditingProduct(updatedProduct);
    setDiscountForm({ quantity: "", rate: "" });
    setErrorMessage("");
  };

  return {
    discountForm,
    errorMessage,
    onChangeDiscountQuantity,
    onChangeDiscountRate,
    onClickRemoveDiscount,
    onClickAddDiscount,
  };
};

export default useDiscountForm;
