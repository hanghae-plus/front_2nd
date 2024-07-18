import { useState } from 'react';
import { Product, Discount } from '../types';

export const useEditingProduct = () => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newDiscount, setNewDiscount] = useState<Discount>({ quantity: 0, rate: 0 });

  const edit = (product: Product) => {
    setEditingProduct({...product});
  };

  const updateName = (newName: string) => {
    if (editingProduct) {
      setEditingProduct({...editingProduct, name: newName});
    }
  };

  const updatePrice = (newPrice: number) => {
    if (editingProduct) {
      setEditingProduct({...editingProduct, price: newPrice});
    }
  };

  const updateStock = (newStock: number) => {
    if (editingProduct) {
      setEditingProduct({...editingProduct, stock: newStock});
    }
  };

  const addDiscount = () => {
    if (editingProduct) {
      setEditingProduct({
        ...editingProduct,
        discounts: [...editingProduct.discounts, newDiscount]
      });
      setNewDiscount({ quantity: 0, rate: 0 });
    }
  };

  const removeDiscount = (index: number) => {
    if (editingProduct) {
      setEditingProduct({
        ...editingProduct,
        discounts: editingProduct.discounts.filter((_, i) => i !== index)
      });
    }
  };

  const clearEditingProduct = () => {
    setEditingProduct(null);
  };

  return {
    editingProduct,
    newDiscount,
    setNewDiscount,
    edit,
    updateName,
    updatePrice,
    updateStock,
    addDiscount,
    removeDiscount,
    clearEditingProduct,
  };
};