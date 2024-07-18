import { Coupon, Product } from "@/types.ts";
import Header from "../Header";
import CouponManagementCard from "./CouponManagementCard";
import ProductManagementCard from "./ProductManagementCard";

interface Props {
  products: Product[];
  coupons: Coupon[];
  onProductUpdate: (updatedProduct: Product) => void;
  onProductAdd: (newProduct: Product) => void;
  onCouponAdd: (newCoupon: Coupon) => void;
}

const AdminPage = ({
  products,
  onProductUpdate,
  onProductAdd,
  coupons,
  onCouponAdd,
}: Props) => {
  return (
    <div className="container mx-auto p-4">
      <Header title="관리자 페이지" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProductManagementCard
          products={products}
          onProductUpdate={onProductUpdate}
          onProductAdd={onProductAdd}
        />
        <CouponManagementCard coupons={coupons} onCouponAdd={onCouponAdd} />
      </div>
    </div>
  );
};

export default AdminPage;
