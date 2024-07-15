import { Product } from "../../../../types.ts";
import { DiscountList } from "./DiscountList.tsx";
import { AddToCartButton } from "./AddToCartButton.tsx";

interface Props {
  product: Product;
  addToCart: (product: Product) => void;
  remainingStock: number;
  maxDiscount: number;
}

export const ProductItem = ({ product, addToCart, remainingStock, maxDiscount }: Props) => (
  <div data-testid={`product-${product.id}`} className="bg-white p-3 rounded shadow">
    <div className="flex justify-between items-center mb-2">
      <span className="font-semibold">{product.name}</span>
      <span className="text-gray-600">{product.price.toLocaleString()}원</span>
    </div>
    <div className="text-sm text-gray-500 mb-2">
      <span className={`font-medium ${remainingStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
        재고: {remainingStock}개
      </span>
      {product.discounts.length > 0 && (
        <span className="ml-2 font-medium text-blue-600">
          최대 {(maxDiscount * 100).toFixed(0)}% 할인
        </span>
      )}
    </div>
    <DiscountList discounts={product.discounts}/>
    <AddToCartButton onClick={() => addToCart(product)} disabled={remainingStock <= 0}/>
  </div>
);
