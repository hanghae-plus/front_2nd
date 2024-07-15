import { useState } from 'react';
import { CartPage } from './components/CartPage.tsx';
import { AdminPage } from './components/AdminPage.tsx';
import { useCoupons, useProducts } from './hooks';
import { initialProducts, initialCoupons } from './data.jsx';
import Header from './components/Header.jsx';

const App = () => {
  const { products, updateProduct, addProduct } = useProducts(initialProducts);
  const { coupons, addCoupon } = useCoupons(initialCoupons);
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className='min-h-screen bg-gray-100'>
      <Header isAdmin setIsAdmin={setIsAdmin} />
      <main className='container mx-auto mt-6'>
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
