import { Coupon, Product, setState } from "@/types";
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
  setIsAdmin: setState<boolean>;
}
const AppView = ({
  products,
  updateProduct,
  addProduct,
  coupons,
  addCoupon,
  isAdmin,
  setIsAdmin,
}: AppViewProps) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <NavigationBar isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
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
