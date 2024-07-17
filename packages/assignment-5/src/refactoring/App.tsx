import { useState } from 'react';
import { CartPage } from './components/CartPage.tsx';
import { AdminPage } from './components/AdminPage.tsx';

import { useCoupons, useProducts } from './hooks';
import { initialCoupons, initialProducts } from './constants';
import { Header } from './components/UI/common/Header.tsx';

const App = () => {
  const { products, updateProduct, addProduct, deleteProduct } =
    useProducts(initialProducts);
  const { coupons, addCoupon } = useCoupons(initialCoupons);
  const [isAdmin, setIsAdmin] = useState(false);

  const props = {
    products,
    coupons,
  };

  const utils = {
    updateProduct,
    addProduct,
    deleteProduct,
    addCoupon,
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header onClick={() => setIsAdmin(!isAdmin)} isAdmin={isAdmin} />
      <main className="container mx-auto mt-6">
        {isAdmin ? (
          <AdminPage {...props} {...utils} />
        ) : (
          <CartPage {...props} />
        )}
      </main>
    </div>
  );
};

export default App;
