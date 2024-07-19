import { Coupon, Product } from "../../../types.ts";

import ProductManangeCard from "./ProductManangeCard.tsx";
import CartHistoryCard from "./CartHistoryCard.tsx";

interface Props {
  products: Product[];
  coupons: Coupon[];
  updateProduct: (updatedProduct: Product) => void;
  addProduct: (newProduct: Product) => void;
  addCoupon: (newCoupon: Coupon) => void;
}

export const AdminPage = ({
  products,
  coupons,
  updateProduct,
  addProduct,
  addCoupon,
}: Props) => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">관리자 페이지</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProductManangeCard
          products={products}
          addProduct={addProduct}
          updateProduct={updateProduct}
        />
        <CartHistoryCard coupons={coupons} addCoupon={addCoupon} />
      </div>
    </div>
  );
};
