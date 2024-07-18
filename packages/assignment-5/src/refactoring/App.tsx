import { Coupon, Product } from '../types.ts';
import { AdminPage } from './common/components/AdminPage.tsx';
import { CartPage } from './common/components/CartPage.tsx';
import Navigation from './common/components/navigation/index.tsx';
import AdminProvider from './common/context/AdminContext.tsx';
import { useAdmin } from './common/hooks/useAdmin.ts';
import PageLayout from './common/layout/PageLayout.tsx';

const initialProducts: Product[] = [
  {
    id: 'p1',
    name: '상품1',
    price: 10000,
    stock: 20,
    discounts: [
      { quantity: 10, rate: 0.1 },
      { quantity: 20, rate: 0.2 }
    ]
  },
  {
    id: 'p2',
    name: '상품2',
    price: 20000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.15 }]
  },
  {
    id: 'p3',
    name: '상품3',
    price: 30000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.2 }]
  }
];

const initialCoupons: Coupon[] = [
  {
    name: '5000원 할인 쿠폰',
    code: 'AMOUNT5000',
    discountType: 'amount',
    discountValue: 5000
  },
  {
    name: '10% 할인 쿠폰',
    code: 'PERCENT10',
    discountType: 'percentage',
    discountValue: 10
  }
];

const App = () => {
  return (
    <AdminProvider>
      <PageLayout>
        <Navigation />
        <Main />
      </PageLayout>
    </AdminProvider>
  );
};

export default App;
