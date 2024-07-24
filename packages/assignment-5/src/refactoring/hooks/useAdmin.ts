import { useState } from 'react';
import { Coupon, Discount, Product } from '../../types';

export const useAdmin = (
  products: Product[],
  onProductUpdate: (updatedProduct: Product) => void,
  onProductAdd: (newProduct: Product) => void,
  onCouponAdd: (newCoupon: Coupon) => void,
) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newDiscount, setNewDiscount] = useState<Discount>({
    quantity: 0,
    rate: 0,
  });

  const [newCoupon, setNewCoupon] = useState<Coupon>({
    name: '',
    code: '',
    discountType: 'percentage',
    discountValue: 0,
  });

  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    stock: 0,
    discounts: [],
  });

  const handleAddNewCouponByName = (name: string) => {
    setNewCoupon((prevCoupon) => {
      return { ...prevCoupon, name };
    });
  };

  const handleAddNewCouponByCode = (code: string) => {
    setNewCoupon((prevCoupon) => {
      return { ...prevCoupon, code };
    });
  };

  const handleAddNewCouponByDiscountType = (
    discountType: 'amount' | 'percentage',
  ) => {
    setNewCoupon((prevCoupon) => {
      return { ...prevCoupon, discountType };
    });
  };

  const handleOnChangeNewProduct = (name: string) => {
    setNewProduct((preNewProduct) => {
      return { ...preNewProduct, name };
    });
  };

  // handleEditProduct 함수 수정
  const handleEditProduct = (product: Product) => {
    setEditingProduct({ ...product });
  };

  // 새로운 핸들러 함수 추가
  const handleProductNameUpdate = (productId: string, newName: string) => {
    if (editingProduct && editingProduct.id === productId) {
      const updatedProduct = { ...editingProduct, name: newName };
      setEditingProduct(updatedProduct);
    }
  };

  // 새로운 핸들러 함수 추가
  const handlePriceUpdate = (productId: string, newPrice: number) => {
    if (editingProduct && editingProduct.id === productId) {
      const updatedProduct = { ...editingProduct, price: newPrice };
      setEditingProduct(updatedProduct);
    }
  };

  // 수정 완료 핸들러 함수 추가
  const handleEditComplete = () => {
    if (editingProduct) {
      onProductUpdate(editingProduct);
      setEditingProduct(null);
    }
  };

  const handleStockUpdate = (productId: string, newStock: number) => {
    const updatedProduct = products.find((p) => p.id === productId);
    if (updatedProduct) {
      const newProduct = { ...updatedProduct, stock: newStock };
      onProductUpdate(newProduct);
      setEditingProduct(newProduct);
    }
  };

  const handleAddDiscount = (productId: string) => {
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

  const handleRemoveDiscount = (productId: string, index: number) => {
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

  const handleAddCoupon = () => {
    onCouponAdd(newCoupon);
    setNewCoupon({
      name: '',
      code: '',
      discountType: 'percentage',
      discountValue: 0,
    });
  };

  const handleAddNewProduct = () => {
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

  const handleAddQuantityDiscount = (quantity: number) => {
    setNewDiscount((prevDiscount) => {
      return { ...prevDiscount, quantity };
    });
  };
  const handleAddPercentDiscount = (rate: number) => {
    setNewDiscount((prevDiscount) => {
      return { ...prevDiscount, rate };
    });
  };
  const handleOnChangeNewProductPrice = (price: number) => {
    setNewProduct((prevNewProduct) => {
      return {
        ...prevNewProduct,
        price,
      };
    });
  };

  const handleOnChangeNewProductStock = (stock: number) => {
    setNewProduct((prevNewProduct) => {
      return {
        ...prevNewProduct,
        stock,
      };
    });
  };

  const toggleNewProductForm = () => {
    setShowNewProductForm((prevShowNewProductForm) => !prevShowNewProductForm);
  };
  const [showNewProductForm, setShowNewProductForm] = useState(false);

  const handleOnChangeDiscountValue = (discountValue: number) => {
    setNewCoupon((prevNewCoupon) => {
      return { ...prevNewCoupon, discountValue };
    });
  };

  return {
    editingProduct,
    newDiscount,
    newCoupon,
    newProduct,
    setNewCoupon,
    showNewProductForm,
    handleEditProduct,
    handleProductNameUpdate,
    handlePriceUpdate,
    handleEditComplete,
    handleAddCoupon,
    handleAddNewProduct,
    handleStockUpdate,
    handleAddDiscount,
    handleRemoveDiscount,
    handleAddQuantityDiscount,
    handleAddPercentDiscount,
    handleAddNewCouponByName,
    handleAddNewCouponByCode,
    handleAddNewCouponByDiscountType,
    handleOnChangeDiscountValue,
    handleOnChangeNewProduct,
    handleOnChangeNewProductPrice,
    handleOnChangeNewProductStock,
    toggleNewProductForm,
  };
};
