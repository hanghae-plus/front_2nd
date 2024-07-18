import { DiscountForm, InputEventHandler, Product } from "@/types";
import { useState } from "react";
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
      setErrorMessage("할인 수량은 0 이상의 숫자여야 합니다.");

      return;
    }
    if (!isValidRate) {
      setErrorMessage("할인율은 0~100 사이의 숫자여야 합니다.");

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
