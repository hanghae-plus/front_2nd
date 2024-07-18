import type { Coupon, Product } from "types";

import ManageCoupon from "refactoring/components/admin/ManageCoupon/index";
import ManageProduct from "refactoring/components/admin/ManageProduct";

interface Props {
  products: Product[];
  coupons: Coupon[];
  onProductUpdate: (updatedProduct: Product) => void;
  onAddProduct: (newProduct: Product) => void;
  onAddCoupon: (newCoupon: Coupon) => void;
}

export const AdminPage = ({
  products,
  coupons,
  onProductUpdate,
  onAddProduct,
  onAddCoupon,
}: Props) => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">관리자 페이지</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <ManageProduct
            products={products}
            onProductUpdate={onProductUpdate}
            onAddProduct={onAddProduct}
          />
        </div>
        <div>
          <ManageCoupon coupons={coupons} onAddCoupon={onAddCoupon} />
        </div>
      </div>
    </div>
  );
};
