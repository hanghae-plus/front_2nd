import { useState } from "react";
import type { Product } from "types";

import EditProductInfo from "./EditProductInfo";
import EditProductDiscount from "./EditProductDiscount";
import { useProductContext } from "refactoring/components/provider/product/useProductContext";

interface ProductItemProps {
  product: Product;
  index: number;
}

const ProductItem = ({ product, index }: ProductItemProps) => {
  const { editingProduct, setEditingProduct } = useProductContext();
  const [openProductIds, setOpenProductIds] = useState<Set<string>>(new Set());

  const toggleProductAccordion = (productId: string) => {
    setOpenProductIds((prevIds) => {
      const newIds = new Set(prevIds);
      const isAlreadyOpen = newIds.has(productId);
      return isAlreadyOpen
        ? (newIds.delete(productId), newIds)
        : (newIds.add(productId), newIds);
    });
  };

  // handleEditProduct 함수 수정
  const handleEditProduct = (product: Product) => {
    setEditingProduct({ ...product });
  };

  const isOpenProductItem = openProductIds.has(product.id);
  const isEditingProduct = editingProduct && editingProduct.id === product.id;

  return (
    <div
      key={product.id}
      data-testid={`product-${index + 1}`}
      className="bg-white p-4 rounded shadow"
    >
      <button
        data-testid="toggle-button"
        onClick={() => toggleProductAccordion(product.id)}
        className="w-full text-left font-semibold"
      >
        {product.name} - {product.price}원 (재고: {product.stock})
      </button>
      {isOpenProductItem && (
        <div className="mt-2">
          {isEditingProduct ? (
            <div>
              <EditProductInfo />
              <EditProductDiscount />
            </div>
          ) : (
            <div>
              {product.discounts.map((discount, index) => (
                <div key={index} className="mb-2">
                  <span>
                    {discount.quantity}개 이상 구매 시 {discount.rate * 100}%
                    할인
                  </span>
                </div>
              ))}
              <button
                data-testid="modify-button"
                onClick={() => handleEditProduct(product)}
                className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mt-2"
              >
                수정
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductItem;
