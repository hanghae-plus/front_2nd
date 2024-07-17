import { CartPage } from './CartPage.tsx';
import { AdminPage } from './AdminPage.tsx';
import { useCoupons, useProducts } from '../hooks';
import { initialProducts, initialCoupons } from '../data.js';

export default function MainPage({ isAdmin }) {
  const { products, updateProduct, addProduct } = useProducts(initialProducts);
  const { coupons, addCoupon } = useCoupons(initialCoupons);

  return (
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
  );
}
