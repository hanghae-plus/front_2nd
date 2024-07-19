import { useState } from 'react';

import { Product } from '../../../types';

export const useProductForm = () => {
  const [showNewProductForm, setShowNewProductForm] = useState(false);
  const updateShowNewProductForm = (showNewProductForm: boolean) => {
    setShowNewProductForm(showNewProductForm);
  };

  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    stock: 0,
    discounts: [],
  });
  const updateNewProduct = (newProduct: Omit<Product, 'id'>) => {
    setNewProduct({ ...newProduct });
  };

  const handleAddNewProduct = (onProductAdd: (newProduct: Product) => void, newProduct: Omit<Product, 'id'>) => {
    const productWithId = { ...newProduct, id: Date.now().toString() };
    onProductAdd(productWithId);
    setNewProduct({
      name: '',
      price: 0,
      stock: 0,
      discounts: [],
    });
    setShowNewProductForm(false);
  };

  return { showNewProductForm, updateShowNewProductForm, newProduct, updateNewProduct, handleAddNewProduct };
};
