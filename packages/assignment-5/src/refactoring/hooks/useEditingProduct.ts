// advanced에서 useEditingProduct를 test를 위해 hook으로 분리
import { useState } from 'react';
import { Product } from '../types';

export const useEditingProduct = () => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

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

  const clearEditingProduct = () => {
    setEditingProduct(null);
  };

  return {
    editingProduct,
    edit,
    updateName,
    updatePrice,
    updateStock,
    clearEditingProduct
  };
};