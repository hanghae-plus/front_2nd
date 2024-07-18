import { useState } from 'react';
import { CartPage } from './components/CartPage.tsx';
import { AdminPage } from './components/AdminPage.tsx';

import { useCoupons, useProducts } from './hooks';
import { initialCoupons, initialProducts } from './constants';
import { Header } from './components/UI/common/Header.tsx';
import { CouponsContext, ProductsContext } from './contexts/index.ts';

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header onClick={() => setIsAdmin(!isAdmin)} isAdmin={isAdmin} />
      <CouponsContext.Provider value={useCoupons(initialCoupons)}>
        <ProductsContext.Provider value={useProducts(initialProducts)}>
          <main className="container mx-auto mt-6">
            {isAdmin ? <AdminPage /> : <CartPage />}
          </main>
        </ProductsContext.Provider>
      </CouponsContext.Provider>
    </div>
  );
};

export default App;
