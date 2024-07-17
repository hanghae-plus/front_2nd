import { Discount, Product } from "../../../types.ts";
import { useState } from "react";

export interface Props {
  product: Product;
  productIndex: number;
  updateProduct: (productData: Product) => void;
}

export function ProductInfo({ product, productIndex, updateProduct }: Props) {
  const [isAccordionUnfolded, setIsAccordionUnfolded] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [editingProduct, setEditingProduct] = useState(product);
  const [newDiscount, setNewDiscount] = useState<Discount>({
    rate: 0,
    quantity: 0,
  });

  const handleToggleButtonClick = () => {
    setIsAccordionUnfolded((prev) => !prev);
  };

  const handleModifyButtonClick = () => {
    setIsEditMode((prev) => !prev);
  };

  const handleEditCompleteButtonClick = () => {
    updateProduct(editingProduct);
    setIsEditMode(false);
  };

  const handleEditingProductUpdate = <F extends keyof Product>(
    field: F,
    value: Product[F],
  ) => {
    setEditingProduct((prev) => ({ ...prev, [field]: value }));
  };

  const handleNewDiscountUpdate = <F extends keyof Discount>(
    field: F,
    value: Discount[F],
  ) => {
    setNewDiscount((prev) => ({ ...prev, [field]: value }));
  };

  const handleRemoveDiscount = (discountIndex: number) => {
    updateProduct({
      ...product,
      // splice는 안될까?
      // discounts: product.discounts.splice(discountIndex, 1),
      discounts: product.discounts.reduce(
        (acc, curr, currentIndex) =>
          currentIndex === discountIndex ? acc : acc.concat(curr),
        [] as Discount[],
      ),
    });
  };

  const handleAddDiscount = () => {
    updateProduct({
      ...product,
      discounts: [...product.discounts, newDiscount],
    });
  };

  return (
    <div
      key={product.id}
      data-testid={`product-${productIndex + 1}`}
      className="bg-white p-4 rounded shadow"
    >
      <button
        data-testid="toggle-button"
        onClick={handleToggleButtonClick}
        className="w-full text-left font-semibold"
      >
        {product.name} - {product.price}원 (재고: {product.stock})
      </button>
      {isAccordionUnfolded && (
        <div className="mt-2">
          {isEditMode ? (
            <div>
              <div className="mb-4">
                <label className="block mb-1">상품명: </label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) =>
                    handleEditingProductUpdate("name", e.target.value)
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
                    handleEditingProductUpdate(
                      "price",
                      parseInt(e.target.value),
                    )
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
                    handleEditingProductUpdate(
                      "stock",
                      parseInt(e.target.value),
                    )
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              {/* 할인 정보 수정 부분 */}
              <div>
                <h4 className="text-lg font-semibold mb-2">할인 정보</h4>
                {product.discounts.map((discount, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center mb-2"
                  >
                    <span>
                      {discount.quantity}개 이상 구매 시 {discount.rate * 100}%
                      할인
                    </span>
                    <button
                      onClick={() => handleRemoveDiscount(index)}
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
                    onChange={(e) =>
                      handleNewDiscountUpdate(
                        "quantity",
                        parseInt(e.target.value),
                      )
                    }
                    className="w-1/3 p-2 border rounded"
                  />
                  <input
                    type="number"
                    placeholder="할인율 (%)"
                    value={newDiscount.rate * 100}
                    onChange={(e) => {
                      handleNewDiscountUpdate(
                        "rate",
                        parseInt(e.target.value) / 100,
                      );
                    }}
                    className="w-1/3 p-2 border rounded"
                  />
                  <button
                    onClick={handleAddDiscount}
                    className="w-1/3 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                  >
                    할인 추가
                  </button>
                </div>
              </div>
              <button
                onClick={handleEditCompleteButtonClick}
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
                    {discount.quantity}개 이상 구매 시 {discount.rate * 100}%
                    할인
                  </span>
                </div>
              ))}
              <button
                data-testid="modify-button"
                onClick={handleModifyButtonClick}
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
}
