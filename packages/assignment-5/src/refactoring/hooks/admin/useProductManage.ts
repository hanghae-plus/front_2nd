import { useState } from 'react';

import { Discount, Product } from '../../../types';

export const useProductManage = () => {
  const [openProductIds, setOpenProductIds] = useState<Set<string>>(new Set());
  const updateOpenProductIds = (newOpenProductIds: Set<string>) => {
    setOpenProductIds({ ...newOpenProductIds });
  };
  const toggleProductAccordion = (productId: string) => {
    setOpenProductIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const updateEditingProduct = (newEditingProduct: Product | null) => {
    setEditingProduct(newEditingProduct ? { ...newEditingProduct } : null);
  };
  const updateProductName = (editingProduct: Product | null, productId: string, newName: string) => {
    if (editingProduct && editingProduct.id === productId) {
      const updatedProduct = { ...editingProduct, name: newName };
      setEditingProduct(updatedProduct);
    }
  };
  const updatePrice = (editingProduct: Product | null, productId: string, newPrice: number) => {
    if (editingProduct && editingProduct.id === productId) {
      const updatedProduct = { ...editingProduct, price: newPrice };
      setEditingProduct(updatedProduct);
    }
  };
  const completeEdit = (editingProduct: Product | null, onProductUpdate: (updatedProduct: Product) => void) => {
    if (editingProduct) {
      onProductUpdate(editingProduct);
      setEditingProduct(null);
    }
  };

  const [newDiscount, setNewDiscount] = useState<Discount>({ quantity: 0, rate: 0 });
  const updateNewDiscount = (newDiscount: Discount) => {
    setNewDiscount({ ...newDiscount });
  };

  const updateStock = (
    products: Product[],
    productId: string,
    newStock: number,
    onProductUpdate: (updatedProduct: Product) => void,
  ) => {
    const updatedProduct = products.find((p) => p.id === productId);
    if (updatedProduct) {
      const newProduct = { ...updatedProduct, stock: newStock };
      onProductUpdate(newProduct);
      setEditingProduct(newProduct);
    }
  };

  const addDiscount = (products: Product[], productId: string, onProductUpdate: (updatedProduct: Product) => void) => {
    const updatedProduct = products.find((p) => p.id === productId);
    if (updatedProduct && editingProduct) {
      const newProduct = {
        ...updatedProduct,
        discounts: [...updatedProduct.discounts, newDiscount],
      };
      onProductUpdate(newProduct);
      setEditingProduct(newProduct);
      setNewDiscount({ quantity: 0, rate: 0 });
    }
  };

  const removeDiscount = (
    products: Product[],
    productId: string,
    index: number,
    onProductUpdate: (updatedProduct: Product) => void,
  ) => {
    const updatedProduct = products.find((p) => p.id === productId);
    if (updatedProduct) {
      const newProduct = {
        ...updatedProduct,
        discounts: updatedProduct.discounts.filter((_, i) => i !== index),
      };
      onProductUpdate(newProduct);
      setEditingProduct(newProduct);
    }
  };

  return {
    openProductIds,
    updateOpenProductIds,
    toggleProductAccordion,
    editingProduct,
    updateEditingProduct,
    updateProductName,
    updatePrice,
    completeEdit,
    newDiscount,
    updateNewDiscount,
    updateStock,
    addDiscount,
    removeDiscount,
  };
};
