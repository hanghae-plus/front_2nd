import { useCallback, useState } from 'react';

import type { Discount, Product } from '../../types';

export const useDiscountForm = (
  product: Product,
  onProductUpdate: (updatedProduct: Product) => void,
) => {
  const [discount, setDiscount] = useState<Discount>({ quantity: 0, rate: 0 });

  const editProperty = useCallback(
    <K extends keyof Discount>(key: K, value: Discount[K]) => {
      if (discount) {
        setDiscount({
          ...discount,
          [key]: value,
        });
      }
    },
    [discount],
  );

  const add = useCallback(() => {
    if (discount.quantity === 0 || discount.rate === 0) {
      return;
    }
    const updatedProduct = {
      ...product,
      discounts: [...product.discounts, discount],
    };
    onProductUpdate(updatedProduct);
    setDiscount({ quantity: 0, rate: 0 });
  }, [discount, onProductUpdate, product]);

  const remove = useCallback(
    (discountIndex: number) => {
      const updatedProduct = {
        ...product,
        discounts: product.discounts.filter(
          (_, index) => index !== discountIndex,
        ),
      };
      onProductUpdate(updatedProduct);
    },
    [onProductUpdate, product],
  );

  return { discount, editProperty, add, remove };
};
