import { AdminPage } from "@/refactoring/components/AdminPage";
import { CartPage } from "@/refactoring/components/CartPage";
import { useCoupons, useProducts } from "@/refactoring/hooks";
import { data as COUPONS } from "@/refactoring/mocks/coupons.json";
import { data as PRODUCTS } from "@/refactoring/mocks/products.json";
import { Coupon, Product } from "@/types.ts";
import { useCallback, useState } from "react";

interface HeaderProps {
  isAdmin: boolean;
  onClickSwitchPage: () => void;
}
const Header = ({ isAdmin, onClickSwitchPage }: HeaderProps) => {
  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">쇼핑몰 관리 시스템</h1>
        <button
          onClick={onClickSwitchPage}
          className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100"
        >
          {isAdmin ? "장바구니 페이지로" : "관리자 페이지로"}
        </button>
      </div>
    </nav>
  );
};

const App = () => {
  const { products, updateProduct, addProduct } = useProducts(
    PRODUCTS as Product[]
  );
  const { coupons, addCoupon } = useCoupons(COUPONS as Coupon[]);
  const [isAdmin, setIsAdmin] = useState(false);

  const onClickSwitchPage = useCallback(() => {
    setIsAdmin((prev) => !prev);
  }, [setIsAdmin]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header isAdmin={isAdmin} onClickSwitchPage={onClickSwitchPage} />
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

export default App;
