import { useState } from 'react';

import { useProductReducer } from '../../../../common/hooks/reducer/useProductReducer';
import { Product } from '../../../../common/models';

export const useProductAdmin = () => {
  const { products, addProduct, updateProduct } = useProductReducer();
  const [openProductIds, setOpenProductIds] = useState<Set<string>>(new Set());
  const [showNewProductForm, setShowNewProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    stock: 0,
    discounts: []
  });

  const handleToggleShowNewProductForm = () => setShowNewProductForm(!showNewProductForm);

  const handleChangeNewProduct = (e: React.ChangeEvent<HTMLInputElement>) => (key: keyof Omit<Product, 'id'>) => {
    const changedValue = e.target.value;

    setNewProduct((prevProduct) => ({
      ...prevProduct,
      [key]: typeof changedValue === 'number' ? parseInt(changedValue) : changedValue
    }));
  };

  const handleAddNewProduct = () => {
    const productWithId = { ...newProduct, id: Date.now().toString() };
    addProduct(productWithId);
    setNewProduct({
      name: '',
      price: 0,
      stock: 0,
      discounts: []
    });
    setShowNewProductForm(false);
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

  const handleUpdateProduct =
    (e: React.ChangeEvent<HTMLInputElement>) => (productId: string, key: keyof Omit<Product, 'id'>) => {
      if (editingProduct && editingProduct.id === productId) {
        const changedValue = e.target.value;
        setEditingProduct((prevProduct) => {
          if (!prevProduct) return null;
          return {
            ...prevProduct,
            [key]: typeof changedValue === 'number' ? parseInt(changedValue) : changedValue
          };
        });
      }
    };

  const handleProductNameUpdate = (e: React.ChangeEvent<HTMLInputElement>) => (productId: string) =>
    handleUpdateProduct(e)(productId, 'name');

  const handlePriceUpdate = (e: React.ChangeEvent<HTMLInputElement>) => (productId: string) =>
    handleUpdateProduct(e)(productId, 'price');

  const handleStockUpdate = (e: React.ChangeEvent<HTMLInputElement>) => (productId: string) =>
    handleUpdateProduct(e)(productId, 'stock');

  const handleEditComplete = () => {
    if (editingProduct) {
      updateProduct(editingProduct);
      setEditingProduct(null);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct({ ...product });
  };

  return {
    products,
    openProductIds,
    showNewProductForm,
    editingProduct,
    newProduct,
    handleToggleShowNewProductForm,
    handleChangeNewProduct,
    handleAddNewProduct,
    toggleProductAccordion,
    handleProductNameUpdate,
    handlePriceUpdate,
    handleStockUpdate,
    handleEditComplete,
    handleEditProduct
  };
};
