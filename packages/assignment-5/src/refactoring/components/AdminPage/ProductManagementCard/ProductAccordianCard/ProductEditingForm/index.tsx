import useEditProductInform from "@/refactoring/hooks/useEditProductInform";
import { Discount, InputEventHandler, Product, setState } from "@/types";
import { useState } from "react";
import ProductEditingFormView from "./view";

interface Props {
  onProductUpdate: (updatedProduct: Product) => void;
  product: Product;
  setIsEditing: setState<boolean>;
}
const ProductEditingForm = ({
  onProductUpdate,
  product,
  setIsEditing,
}: Props) => {
  const editProductInform = useEditProductInform(product);

  const [newDiscount, setNewDiscount] = useState<Discount>({
    quantity: 0,
    rate: 0,
  });

  const onChangeDiscountQuantity: InputEventHandler = (event) => {
    const updatedDiscount = {
      ...newDiscount,
      quantity: parseInt(event.target.value),
    };
    setNewDiscount(updatedDiscount);
  };

  const onChangeDiscountRate: InputEventHandler = (event) => {
    const updatedDiscount = {
      ...newDiscount,
      rate: parseInt(event.target.value) / 100,
    };
    setNewDiscount(updatedDiscount);
  };

  const onClickRemoveDiscount = (index: number) => {
    const updatedProduct = {
      ...editProductInform.editingProduct,
      discounts: editProductInform.editingProduct.discounts.filter(
        (_, i) => i !== index
      ),
    };
    onProductUpdate(updatedProduct);
    editProductInform.setEditingProduct(updatedProduct);
  };

  const onClickAddDiscount = () => {
    const updatedProduct = {
      ...editProductInform.editingProduct,
      discounts: [...editProductInform.editingProduct.discounts, newDiscount],
    };
    onProductUpdate(updatedProduct);
    editProductInform.setEditingProduct(updatedProduct);
    setNewDiscount({ quantity: 0, rate: 0 });
  };

  const onClickEditComplete = () => {
    onProductUpdate(editProductInform.editingProduct);
    setIsEditing(false);
  };

  const props = {
    ...editProductInform,
    newDiscount,
    onClickRemoveDiscount,
    onChangeDiscountQuantity,
    onChangeDiscountRate,
    onClickAddDiscount,
    onClickEditComplete,
  };
  return <ProductEditingFormView {...props} />;
};

export default ProductEditingForm;
