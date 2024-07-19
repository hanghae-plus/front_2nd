import { Coupon, Product } from '../../types.ts';
import { useLocalStorage } from '../hooks';
import { CartListItem } from './cart/CartListItem.tsx';
import { CouponApply } from './cart/CouponApply.tsx';
import { OrderSummary } from './cart/OrderSummary.tsx';
import { ProductListItem } from './cart/ProductListItem.tsx';

interface Props {
  products: Product[];
  coupons: Coupon[];
}

export const CartPage = ({ products, coupons }: Props) => {
  const {
    cart,
    cartItemsCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    checkAndApplyCoupon,
    calculateTotal,
    selectedCoupon,
    getRemainingStock,
    getAppliedDiscount,
  } = useLocalStorage();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">장바구니</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">상품 목록</h2>
          <div className="space-y-2">
            {products.map((product) => (
              <ProductListItem
                product={product}
                addToCart={addToCart}
                remainingStock={getRemainingStock(product)}
              />
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">장바구니 내역</h2>

          <div className="space-y-2">
            {cart.map((item) => (
              <CartListItem
                cartItem={item}
                appliedDiscount={getAppliedDiscount(item)}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
              />
            ))}
          </div>

          <CouponApply
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            applyCoupon={applyCoupon}
            cartItemsCount={cartItemsCount}
            handleChange={(e) => checkAndApplyCoupon(e, coupons)}
          />

          <div className="mt-6 bg-white p-4 rounded shadow">
            <h2 className="text-2xl font-semibold mb-2">주문 요약</h2>
            <OrderSummary {...calculateTotal()} />
          </div>
        </div>
      </div>
    </div>
  );
};
