import { useContext } from 'react';
import { DisplayContext } from './layouts/CartLayout.tsx';

import { AdminPage } from './components/AdminPage.tsx';
import { CartPage } from './components/CartPage.tsx';

import { useCoupons, useProducts } from './hooks';

import { initialCoupons, initialProducts } from './constants/constant.ts';
import { Coupon, Product } from '../types.ts';

type Props = {
  isAdmin: boolean;
  products: Product[];
  coupons: Coupon[];
  updateProduct: (updatedProduct: Product) => void;
  addProduct: (newProduct: Product) => void;
  addCoupon: (newCoupon: Coupon) => void;
};

const MainPageView = ({
  isAdmin,
  products,
  coupons,
  updateProduct,
  addProduct,
  addCoupon,
}: Props) => {
  return (
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
  );
};

const MainPage = () => {
  const isAdmin = useContext(DisplayContext);

  const { products, updateProduct, addProduct } = useProducts(initialProducts);
  const { coupons, addCoupon } = useCoupons(initialCoupons);

  const props = {
    isAdmin,
    products,
    updateProduct,
    addProduct,
    coupons,
    addCoupon,
  };

  return <MainPageView {...props} />;
};

export default MainPage;
