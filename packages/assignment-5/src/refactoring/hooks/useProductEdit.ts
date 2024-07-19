import { useState } from "react";
import { Product } from "../../types";

export const useProductEdit = (
  onProductUpdate: (updatedProduct: Product) => void,
  products: Product[]
) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  /**
   * 상품 이름 업데이트 함수
   * @param productId
   * @param newName
   */
  const updateProductName = (productId: string, newName: string) => {
    if (editingProduct && editingProduct.id === productId) {
      const updatedProduct = { ...editingProduct, name: newName };
      setEditingProduct(updatedProduct);
    }
  };

  /**
   * 가격 업데이트 함수
   * @param productId
   * @param newPrice
   */
  const updatePrice = (productId: string, newPrice: number) => {
    if (editingProduct && editingProduct.id === productId) {
      const updatedProduct = { ...editingProduct, price: newPrice };
      setEditingProduct(updatedProduct);
    }
  };

  /**
   * 수정 완료하는 함수
   * @returns
   */
  const completeEdit = () => {
    if (!editingProduct) {
      return;
    }
    onProductUpdate(editingProduct);
    setEditingProduct(null);
  };

  /**
   * 재고를 업데이트하는 함수
   * @param productId
   * @param newStock
   */
  const updateStock = (productId: string, newStock: number) => {
    const updatedProduct = products.find((p) => p.id === productId);
    if (updatedProduct) {
      const newProduct = { ...updatedProduct, stock: newStock };
      onProductUpdate(newProduct);
      setEditingProduct(newProduct);
    }
  };

  /**
   * 할인을 제거하는 함수
   * @param productId
   * @param index
   */
  const removeDiscount = (productId: string, index: number) => {
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

  const onClickEditProduct = (product: Product) => {
    setEditingProduct(product);
  };

  const onChangeProductNameUpdate = (productId: string, newName: string) => {
    updateProductName(productId, newName);
  };

  const onChangeUpdatePrice = (productId: string, newPrice: number) => {
    updatePrice(productId, newPrice);
  };

  const onClickCompleteEdit = () => {
    completeEdit();
  };

  const onChangeUpdateStock = (productId: string, newStock: number) => {
    updateStock(productId, newStock);
  };

  const onClickRemoveDiscount = (productId: string, index: number) => {
    removeDiscount(productId, index);
  };

  return {
    editingProduct,
    onClickEditProduct,
    onChangeProductNameUpdate,
    onChangeUpdatePrice,
    onClickCompleteEdit,
    onChangeUpdateStock,
    onClickRemoveDiscount,
    setEditingProduct,
  };
};
