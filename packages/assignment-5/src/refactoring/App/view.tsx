import { Coupon, Product } from "@/types";
import AdminPage from "../components/AdminPage";
import CartPage from "../components/CartPage";
import NavigationBar from "../components/NavigationBar";

interface AppViewProps {
  products: Product[];
  updateProduct: (newProduct: Product) => void;
  addProduct: (newProduct: Product) => void;
  coupons: Coupon[];
  addCoupon: (newCoupon: Coupon) => void;
  isAdmin: boolean;
  toggleIsAdmin: () => void;
}
const AppView = ({
  products,
  updateProduct,
  addProduct,
  coupons,
  addCoupon,
  isAdmin,
  toggleIsAdmin,
}: AppViewProps) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <NavigationBar isAdmin={isAdmin} toggleIsAdmin={toggleIsAdmin} />
      <main className="container mx-auto mt-6">
        {isAdmin ? (
          <AdminPage
            products={products}
            coupons={coupons}
            onProductUpdate={updateProduct}
            onProductAdd={addProduct}
            onCouponAdd={addCoupon}
          />
        ) : (
          <CartPage products={products} coupons={coupons} />
        )}
      </main>
    </div>
  );
};

export default AppView;
