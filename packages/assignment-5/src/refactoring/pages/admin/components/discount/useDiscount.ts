import { useState } from 'react';

import { useProductReducer } from '../../../../common/hooks/reducer/useProductReducer';
import { Discount, Product } from '../../../../common/models';

interface Props {
  editingProduct: Product;
  setEditingProduct: (product: Product) => void;
}

export const useDiscount = ({ editingProduct, setEditingProduct }: Props) => {
  const { products, updateProduct } = useProductReducer();

  const [newDiscount, setNewDiscount] = useState<Discount>({ quantity: 0, rate: 0 });

  const handleAddDiscount = (productId: string) => {
    const updatedProduct = products.find((p) => p.id === productId);
    if (updatedProduct && editingProduct) {
      const newProduct = {
        ...updatedProduct,
        discounts: [...updatedProduct.discounts, newDiscount]
      };
      updateProduct(newProduct);
      setEditingProduct(newProduct);
      setNewDiscount({ quantity: 0, rate: 0 });
    }
  };

  const handleRemoveDiscount = (productId: string, index: number) => {
    const updatedProduct = products.find((p) => p.id === productId);
    if (updatedProduct) {
      const newProduct = {
        ...updatedProduct,
        discounts: updatedProduct.discounts.filter((_, i) => i !== index)
      };
      updateProduct(newProduct);
      setEditingProduct(newProduct);
    }
  };

  const handleChangeDiscountQuantity = (e: React.ChangeEvent<HTMLInputElement>) => (key: string) => {
    setNewDiscount({ ...newDiscount, [key]: parseInt(e.target.value) });
  };

  const handleChangeDiscountRate = (e: React.ChangeEvent<HTMLInputElement>) => (key: string) => {
    setNewDiscount({ ...newDiscount, [key]: parseInt(e.target.value) / 100 });
  };

  return {
    newDiscount,
    handleAddDiscount,
    handleRemoveDiscount,
    handleChangeDiscountQuantity,
    handleChangeDiscountRate
  };
};
