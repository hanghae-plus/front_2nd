import { useState } from "react";
import { Discount, Product } from "../../types";

export const useDiscountForm = (
  onProductUpdate: (updatedProduct: Product) => void
) => {
  const [newDiscount, setNewDiscount] = useState<Discount>({
    quantity: 0,
    rate: 0,
  });

  const add = (product: Product) => {
    const updatedProduct = {
      ...product,
      discounts: [...product.discounts, newDiscount],
    };
    onProductUpdate(updatedProduct);
    setNewDiscount({ quantity: 0, rate: 0 });
  };

  const remove = (product: Product, index: number) => {
    const updatedProduct = {
      ...product,
      discounts: product.discounts.filter((_, i) => i !== index),
    };
    onProductUpdate(updatedProduct);
  };

  return {
    newDiscount,
    setNewDiscount,
    add,
    remove,
  };
};
