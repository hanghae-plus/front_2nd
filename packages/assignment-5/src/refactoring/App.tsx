import { useEffect, useState } from 'react';
import { AdminPage } from '@admin/index';
import { CartPage } from '@cart/index';
import { Coupon, Product } from '@types';
import Navbar from '@common/components/Navbar';
import { useLocalStorage } from '@common/hooks';

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
  const [isAdmin, setIsAdmin] = useState(false);
  const [products, setProducts] = useLocalStorage<Product[]>('products', []);
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>('coupons', []);

  useEffect(() => {
    // 로컬 스토리지가 비어있을 때만 초기 데이터를 설정합니다
    if (products.length === 0) {
      setProducts(initialProducts);
    }

    if (coupons.length === 0) {
      setCoupons(initialCoupons);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
      <main className="container mx-auto mt-6">{isAdmin ? <AdminPage /> : <CartPage />}</main>
    </div>
  );
};

export default App;
