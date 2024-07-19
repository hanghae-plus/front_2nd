import { useState } from "react";

import { AdminPage } from "./pages/AdminPage.tsx";
import { CartPage } from "./pages/CartPage.tsx";
import { useCoupons, useProducts } from "./hooks";
import { DISCOUNT_COUPONS } from "./model/coupons/discountCoupon.ts";
import { PRODUCTS } from "./model/products/product.ts";
import { CartProvider } from "./store/cartContext.tsx";

const App = () => {
  const { products, updateProduct, addProduct } = useProducts(PRODUCTS);
  const { coupons, addCoupon } = useCoupons(DISCOUNT_COUPONS);
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-blue-6000 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">쇼핑몰 관리 시스템</h1>
            <button
              onClick={() => setIsAdmin(!isAdmin)}
              className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100"
            >
              {isAdmin ? "장바구니 페이지로" : "관리자 페이지로"}
            </button>
          </div>
        </nav>
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
    </CartProvider>
  );
};

export default App;
