import React, { ChangeEvent, FC } from "react";
import { Discount, Product } from "../../../../../../types";
import AdminProductItemToggle from "../item/AdminProductItemToggle";
import { useProductAccordion } from "../../../../../hooks/useProductAccordion";
import useProductDiscount from "../../../../../hooks/useProductDiscount";

interface Props {
  items: Product[];
  onProductUpdate: (updatedProduct: Product) => void;
  editingProduct: Product | null;
  onEditProperty: <K extends keyof Product>(
    productId: string,
    property: K,
    value: Product[K]
  ) => void;
  onSubmit: (product: Product) => void;
}

const AdminProductListBox: FC<Props> = ({
  items,
  onProductUpdate,
  editingProduct,
  onEditProperty,
  onSubmit,
}) => {
  const { openProducts, toggleProductAccordion } = useProductAccordion();

  const {
    newDiscount,
    addDiscount,
    removeDiscount,
    handleChangeDiscount,
    handleChangeDiscountRate,
  } = useProductDiscount({
    editingProduct,
    onEditProperty,
  });

  const handleEditProduct = (product: Product) => {
    onProductUpdate(product);
  };

  const handleProductNameUpdate = (productId: string, newName: string) => {
    onEditProperty(productId, "name", newName);
  };

  const handlePriceUpdate = (productId: string, newPrice: number) => {
    onEditProperty(productId, "price", newPrice);
  };

  const handleStockUpdate = (productId: string, newStock: number) => {
    onEditProperty(productId, "stock", newStock);
  };

  const handleEditComplete = () => {
    if (editingProduct) {
      onSubmit(editingProduct);
    }
  };

  return (
    <div className="space-y-2">
      {items.map((product, index) => (
        <div
          key={product.id}
          data-testid={`product-${index + 1}`}
          className="bg-white p-4 rounded shadow"
        >
          <AdminProductItemToggle
            onClick={() => toggleProductAccordion(product.id)}
            item={product}
          />

          {openProducts.has(product.id) && (
            <div className="mt-2">
              {editingProduct && editingProduct.id === product.id ? (
                <div>
                  <div className="mb-4">
                    <label className="block mb-1">상품명: </label>
                    <input
                      type="text"
                      value={editingProduct.name}
                      onChange={(e) =>
                        handleProductNameUpdate(product.id, e.target.value)
                      }
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">가격: </label>
                    <input
                      type="number"
                      value={editingProduct.price}
                      onChange={(e) =>
                        handlePriceUpdate(product.id, parseInt(e.target.value))
                      }
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">재고: </label>
                    <input
                      type="number"
                      value={editingProduct.stock}
                      onChange={(e) =>
                        handleStockUpdate(product.id, parseInt(e.target.value))
                      }
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  {/* 할인 정보 수정 부분 */}
                  <div>
                    <h4 className="text-lg font-semibold mb-2">할인 정보</h4>
                    {editingProduct.discounts.map((discount, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center mb-2"
                      >
                        <span>
                          {discount.quantity}개 이상 구매 시{" "}
                          {discount.rate * 100}% 할인
                        </span>
                        <button
                          onClick={() => removeDiscount(product.id, index)}
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        >
                          삭제
                        </button>
                      </div>
                    ))}
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        placeholder="수량"
                        value={newDiscount.quantity}
                        onChange={handleChangeDiscount}
                        className="w-1/3 p-2 border rounded"
                      />
                      <input
                        type="number"
                        placeholder="할인율 (%)"
                        value={newDiscount.rate * 100}
                        onChange={handleChangeDiscountRate}
                        className="w-1/3 p-2 border rounded"
                      />
                      <button
                        onClick={() => addDiscount(product.id)}
                        className="w-1/3 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                      >
                        할인 추가
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={handleEditComplete}
                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mt-2"
                  >
                    수정 완료
                  </button>
                </div>
              ) : (
                <div>
                  {product.discounts.map((discount, index) => (
                    <div key={index} className="mb-2">
                      <span>
                        {discount.quantity}개 이상 구매 시 {discount.rate * 100}
                        % 할인
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
      ))}
    </div>
  );
};

export default AdminProductListBox;
