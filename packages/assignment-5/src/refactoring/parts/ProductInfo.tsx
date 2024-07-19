import { Discount, Product } from "../../types.ts";
import { useState } from "react";
import { DiscountForm } from "./DiscountForm.tsx";
import { EditingProduct } from "./EditingProduct.tsx";

export interface Props {
  product: Product;
  productIndex: number;
  updateProduct: (productData: Product) => void;
}

export function ProductInfo({ product, productIndex, updateProduct }: Props) {
  const [isAccordionUnfolded, setIsAccordionUnfolded] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleToggleButtonClick = () => {
    setIsAccordionUnfolded((prev) => !prev);
  };

  const handleModifyButtonClick = () => {
    setIsEditMode((prev) => !prev);
  };

  const handleCompleteEditButtonClick = (product: Product) => {
    updateProduct(product);
    setIsEditMode(false);
  };

  const handleRemoveDiscount = (discountIndex: number) => () => {
    updateProduct({
      ...product,
      // splice는 왜 안될까?
      // discounts: product.discounts.splice(discountIndex, 1),
      discounts: product.discounts.reduce(
        (acc, curr, currentIndex) =>
          currentIndex === discountIndex ? acc : acc.concat(curr),
        [] as Discount[],
      ),
    });
  };

  const handleAddDiscount = (newDiscount: Discount) => {
    updateProduct({
      ...product,
      discounts: [...product.discounts, newDiscount],
    });
  };

  return (
    <div
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
            <EditingProduct
              initialProduct={product}
              completeEdit={handleCompleteEditButtonClick}
            >
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
                      onClick={handleRemoveDiscount(index)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      삭제
                    </button>
                  </div>
                ))}
                <DiscountForm addDiscount={handleAddDiscount} />
              </div>
            </EditingProduct>
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
