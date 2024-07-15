import type { Product } from "types";

import ManageCoupon from "admin/ManageCoupon";
import ManageProduct from "admin/ManageProduct";

interface Props {
  products: Product[];
  onProductUpdate: (updatedProduct: Product) => void;
  onAddProduct: (newProduct: Product) => void;
}

export const AdminPage = ({
  products,
  onProductUpdate,
  onAddProduct,
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
          <ManageCoupon />
        </div>
      </div>
    </div>
  );
};
