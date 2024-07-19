import { useCallback } from "react";
import { Discount, Product } from "../../types";

export const useDiscountForm = (
  updateProduct: (updatedProduct: Product) => void,
  products: Product[]
) => {
  const add = useCallback(
    ({
      productId,
      newDiscount,
    }: {
      productId: string;
      newDiscount: Discount;
    }) => {
      const product = products.find((p) => p.id === productId);
      if (!product) return;

      if (
        newDiscount.quantity <= 0 ||
        newDiscount.rate <= 0 ||
        newDiscount.rate >= 1
      ) {
        return; // Invalid discount
      }

      const updatedProduct = {
        ...product,
        discounts: [...product.discounts, newDiscount],
      };
      updateProduct(updatedProduct);
    },
    [products, updateProduct]
  );

  const remove = useCallback(
    ({
      productId,
      discountIndex,
    }: {
      productId: string;
      discountIndex: number;
    }) => {
      const product = products.find((p) => p.id === productId);
      if (!product) return;

      const updatedDiscounts = product.discounts.filter(
        (_, index) => index !== discountIndex
      );
      const updatedProduct = {
        ...product,
        discounts: updatedDiscounts,
      };
      updateProduct(updatedProduct);
    },
    [products, updateProduct]
  );

  return { add, remove };
};
