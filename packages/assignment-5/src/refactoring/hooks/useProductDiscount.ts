import React, { ChangeEvent, KeyboardEventHandler } from "react";
import { Discount, Product } from "../../types";

const useProductDiscount = ({
  editingProduct,
  onEditProperty,
}: {
  editingProduct: Product | null;
  onEditProperty: <K extends keyof Product>(
    productId: string,
    property: K,
    value: Product[K]
  ) => void;
}) => {
  const [newDiscount, setNewDiscount] = React.useState<Discount>({
    quantity: 0,
    rate: 0,
  });

  const addDiscount = (productId: string) => {
    if (editingProduct && newDiscount.quantity > 0 && newDiscount.rate > 0) {
      const updatedDiscounts = [...editingProduct.discounts, newDiscount];
      onEditProperty(productId, "discounts", updatedDiscounts);
      setNewDiscount({ quantity: 0, rate: 0 });
    }
  };

  const removeDiscount = (productId: string, index: number) => {
    if (editingProduct) {
      const updatedDiscounts = editingProduct.discounts.filter(
        (_, i) => i !== index
      );
      onEditProperty(productId, "discounts", updatedDiscounts);
    }
  };

  const handleChangeDiscount = (e: ChangeEvent<HTMLInputElement>) =>
    setNewDiscount({
      ...newDiscount,
      quantity: parseInt(e.target.value),
    });

  const handleChangeDiscountRate = (e: ChangeEvent<HTMLInputElement>) =>
    setNewDiscount({
      ...newDiscount,
      rate: parseInt(e.target.value) / 100,
    });

  return {
    newDiscount,
    addDiscount,
    removeDiscount,
    handleChangeDiscount,
    handleChangeDiscountRate,
  };
};

export default useProductDiscount;
