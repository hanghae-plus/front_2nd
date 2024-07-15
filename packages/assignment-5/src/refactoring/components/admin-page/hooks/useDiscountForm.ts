import { Discount, Product } from "../../../../types.ts";
import { useState } from "react";

export const useDiscountForm = (onProductUpdate: (product: Product) => void, { value, edit }: {
  value: Product | null,
  edit: (newProduct: Product) => void
}) => {
  const [newDiscount, setNewDiscount] = useState<Discount>({ quantity: 0, rate: 0 });

  const add = (product: Product) => {
    if (value && value.id === product.id) {
      const updatedProduct = {
        ...product,
        discounts: [...product.discounts, newDiscount]
      };
      setNewDiscount({ quantity: 0, rate: 0 });
      edit(updatedProduct);
      onProductUpdate(updatedProduct);
    }
  };

  const remove = (product: Product, index: number) => {
    if (value && value.id === product.id) {
      const updatedProduct = {
        ...product,
        discounts: product.discounts.filter((_, i) => i !== index)
      };
      edit(updatedProduct);
      onProductUpdate(updatedProduct);
    }
  };

  return {
    newDiscount,
    setNewDiscount,
    add,
    remove
  };

};
