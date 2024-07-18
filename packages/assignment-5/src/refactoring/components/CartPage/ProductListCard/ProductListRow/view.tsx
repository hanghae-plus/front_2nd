import { wonFormatter } from "@/refactoring/utils/currencyFormatter";
import { isZeroLengthArray } from "@/refactoring/utils/typeNarrowFunctions";
import { Product } from "@/types";

interface Props {
  product: Product;
  maxDiscount: number;
  remainingStock: number;
  isRemain: boolean;
  onClickAddToCart: () => void;
}

const ProductListRowView = ({
  product: { id, name, price, discounts },
  maxDiscount,
  remainingStock,
  isRemain,
  onClickAddToCart,
}: Props) => {
  return (
    <div
      key={id}
      data-testid={`product-${id}`}
      className="bg-white p-3 rounded shadow"
    >
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold">{name}</span>
        <span className="text-gray-600">{wonFormatter(price)}</span>
      </div>
      <div className="text-sm text-gray-500 mb-2">
        <span
          className={`font-medium ${
            isRemain ? "text-green-600" : "text-red-600"
          }`}
        >
          재고: {remainingStock}개
        </span>
        {!isZeroLengthArray(discounts) && (
          <span className="ml-2 font-medium text-blue-600">
            최대 {(maxDiscount * 100).toFixed(0)}% 할인
          </span>
        )}
      </div>
      {!isZeroLengthArray(discounts) && (
        <ul className="list-disc list-inside text-sm text-gray-500 mb-2">
          {discounts.map((discount, index) => (
            <li key={index}>
              {discount.quantity}개 이상: {(discount.rate * 100).toFixed(0)}%
              할인
            </li>
          ))}
        </ul>
      )}
      <button
        onClick={onClickAddToCart}
        className={`w-full px-3 py-1 rounded ${
          isRemain
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
        disabled={!isRemain}
      >
        {isRemain ? "장바구니에 추가" : "품절"}
      </button>
    </div>
  );
};

export default ProductListRowView;
