import { useState, useCallback } from 'react';
import { Product, Discount } from '@types';
import { useProducts } from '@common/hooks';

export const useProductManagement = () => {
  const { products, addProduct, updateProduct } = useProducts();
  const [openProductIds, setOpenProductIds] = useState<Set<string>>(new Set());
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newDiscount, setNewDiscount] = useState<Discount>({ quantity: 0, rate: 0 });
  const [showNewProductForm, setShowNewProductForm] = useState(false);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    stock: 0,
    discounts: []
  });

  const toggleProductAccordion = useCallback((productId: string) => {
    setOpenProductIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  }, []);

  const handleEditProduct = useCallback((product: Product) => {
    setEditingProduct({ ...product });
  }, []);

  const handleProductNameUpdate = useCallback((productId: string, newName: string) => {
    setEditingProduct((prev) => {
      if (prev && prev.id === productId) {
        return { ...prev, name: newName };
      }
      return prev;
    });
  }, []);

  const handlePriceUpdate = useCallback((productId: string, newPrice: number) => {
    setEditingProduct((prev) => {
      if (prev && prev.id === productId) {
        return { ...prev, price: newPrice };
      }
      return prev;
    });
  }, []);

  const handleStockUpdate = useCallback((productId: string, newStock: number) => {
    setEditingProduct((prev) => {
      if (prev && prev.id === productId) {
        return { ...prev, stock: newStock };
      }
      return prev;
    });
  }, []);

  const handleEditComplete = useCallback(() => {
    if (editingProduct) {
      updateProduct(editingProduct.id, editingProduct);
      setEditingProduct(null);
    }
  }, [editingProduct, updateProduct]);

  const handleAddDiscount = useCallback(
    (productId: string) => {
      if (editingProduct && editingProduct.id === productId) {
        const updatedProduct = {
          ...editingProduct,
          discounts: [...editingProduct.discounts, newDiscount]
        };
        setEditingProduct(updatedProduct);
        setNewDiscount({ quantity: 0, rate: 0 });
      }
    },
    [editingProduct, newDiscount]
  );

  const handleRemoveDiscount = useCallback(
    (productId: string, index: number) => {
      if (editingProduct && editingProduct.id === productId) {
        const updatedProduct = {
          ...editingProduct,
          discounts: editingProduct.discounts.filter((_, i) => i !== index)
        };
        setEditingProduct(updatedProduct);
      }
    },
    [editingProduct]
  );

  const handleAddNewProduct = useCallback(() => {
    const productWithId = { ...newProduct, id: Date.now().toString() };
    addProduct(productWithId);
    setNewProduct({
      name: '',
      price: 0,
      stock: 0,
      discounts: []
    });
    setShowNewProductForm(false);
  }, [newProduct, addProduct]);

  return {
    products,
    openProductIds,
    editingProduct,
    newDiscount,
    showNewProductForm,
    newProduct,
    toggleProductAccordion,
    handleEditProduct,
    handleProductNameUpdate,
    handlePriceUpdate,
    handleStockUpdate,
    handleEditComplete,
    handleAddDiscount,
    handleRemoveDiscount,
    setNewDiscount,
    setShowNewProductForm,
    setNewProduct,
    handleAddNewProduct
  };
};
