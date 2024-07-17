// components/cart/CartList.tsx
import type { Product } from "types";
import ProductList from "./ProductList";

const Product = (): JSX.Element => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">상품 목록</h2>
      <div className="space-y-2">
        <ProductList />
      </div>
    </div>
  );
};

export default Product;
