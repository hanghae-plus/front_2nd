import React from 'react';
import { Product, Discount } from '../../../../../types';
import ProductEditForm from '../ProductEditForm';

interface ProductListProps {
  products: Product[];
  openProductIds: Set<string>;
  editingProduct: Product | null;
  newDiscount: Discount;
  toggleProductAccordion: (productId: string) => void;
  handleEditProduct: (product: Product) => void;
  productEditHandlers: {
    handleProductNameUpdate: (productId: string, newName: string) => void;
    handlePriceUpdate: (productId: string, newPrice: number) => void;
    handleStockUpdate: (productId: string, newStock: number) => void;
    handleAddDiscount: (productId: string) => void;
    handleRemoveDiscount: (productId: string, index: number) => void;
    handleEditComplete: () => void;
    setNewDiscount: React.Dispatch<React.SetStateAction<Discount>>;
  };
}

const ProductList = ({
  products,
  openProductIds,
  editingProduct,
  newDiscount,
  toggleProductAccordion,
  handleEditProduct,
  productEditHandlers
}: ProductListProps) => {
  return (
    <div className="space-y-2">
      {products.map((product, index) => (
        <div key={product.id} data-testid={`product-${index + 1}`} className="bg-white p-4 rounded shadow">
          <button
            data-testid="toggle-button"
            onClick={() => toggleProductAccordion(product.id)}
            className="w-full text-left font-semibold"
          >
            {product.name} - {product.price}원 (재고: {product.stock})
          </button>
          {openProductIds.has(product.id) && (
            <div className="mt-2">
              {!editingProduct &&
                product.discounts.map((discount, index) => (
                  <div key={index} className="mb-2">
                    <span>
                      {discount.quantity}개 이상 구매 시 {discount.rate * 100}% 할인
                    </span>
                  </div>
                ))}
              {editingProduct && editingProduct.id === product.id ? (
                <ProductEditForm editingProduct={editingProduct} newDiscount={newDiscount} {...productEditHandlers} />
              ) : (
                <button
                  data-testid="modify-button"
                  onClick={() => handleEditProduct(product)}
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mt-2"
                >
                  수정
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductList;
