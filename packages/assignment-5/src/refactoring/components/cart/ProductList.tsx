import { Product } from "../../../types";
import { getMaxDiscount } from "../../hooks/utils/cartUtils";

interface ProductListProps {
  product: Product;
  remainStock: number;
  addToCart: (product: Product) => void;
}

const ProductList = ({ product, remainStock, addToCart }: ProductListProps) => {
  /**
   *
   * @param product
   */
  const addToCartHandler = (product: Product) => {
    addToCart(product);
  };

  return (
    <div
      key={product.id}
      data-testid={`product-${product.id}`}
      className="bg-white p-3 rounded shadow"
    >
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold">{product.name}</span>
        <span className="text-gray-600">
          {product.price.toLocaleString()}원
        </span>
      </div>
      <div className="text-sm text-gray-500 mb-2">
        <span
          className={`font-medium ${
            remainStock > 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          재고: {remainStock}개
        </span>
        {product.discounts.length > 0 && (
          <span className="ml-2 font-medium text-blue-600">
            최대 {(getMaxDiscount(product.discounts) * 100).toFixed(0)}% 할인
          </span>
        )}
      </div>
      {product.discounts.length > 0 && (
        <ul className="list-disc list-inside text-sm text-gray-500 mb-2">
          {product.discounts.map((discount, index) => (
            <li key={index}>
              {discount.quantity}개 이상: {(discount.rate * 100).toFixed(0)}%
              할인
            </li>
          ))}
        </ul>
      )}
      <button
        onClick={() => addToCartHandler(product)}
        className={`w-full px-3 py-1 rounded ${
          remainStock > 0
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
        disabled={remainStock <= 0}
      >
        {remainStock > 0 ? "장바구니에 추가" : "품절"}
      </button>
    </div>
  );
};

export default ProductList;
