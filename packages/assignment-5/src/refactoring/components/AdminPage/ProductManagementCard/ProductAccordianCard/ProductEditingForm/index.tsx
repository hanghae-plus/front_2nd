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
  const [editingProduct, setEditingProduct] = useState<Product>({ ...product });
  const [newDiscount, setNewDiscount] = useState<Discount>({
    quantity: 0,
    rate: 0,
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

  const onClickRemoveDiscount = (index: number) => {
    const updatedProduct = {
      ...editingProduct,
      discounts: editingProduct.discounts.filter((_, i) => i !== index),
    };
    onProductUpdate(updatedProduct);
    setEditingProduct(updatedProduct);
  };

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

  const onClickAddDiscount = () => {
    const updatedProduct = {
      ...editingProduct,
      discounts: [...editingProduct.discounts, newDiscount],
    };
    onProductUpdate(updatedProduct);
    setEditingProduct(updatedProduct);
    setNewDiscount({ quantity: 0, rate: 0 });
  };

  const onClickEditComplete = () => {
    onProductUpdate(editingProduct);
    setIsEditing(false);
  };

  const props = {
    editingProduct,
    newDiscount,
    onChangeName,
    onChangePrice,
    onChangeStock,
    onClickRemoveDiscount,
    onChangeDiscountQuantity,
    onChangeDiscountRate,
    onClickAddDiscount,
    onClickEditComplete,
  };
  return <ProductEditingFormView {...props} />;
};

export default ProductEditingForm;
