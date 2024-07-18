import type { Coupon, Product } from '../../types.ts';
import { CartListItem } from '../components/cart/CartListItem.tsx';
import { CartWithCoupon } from '../components/cart/CartWithCoupon.tsx';
import { CouponSelector } from '../components/cart/CouponSelector.tsx';
import { Summary } from '../components/cart/Summary.tsx';
import { useCart } from '../hooks/useCart.ts';

interface Props {
  products: Product[];
  coupons: Coupon[];
}

export const CartPage = ({ products, coupons }: Props) => {
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateTotal,
    selectedCoupon,
  } = useCart();

  return (
    <>
      <div>
        <h2 className="text-2xl font-semibold mb-4">상품 목록</h2>
        <div className="space-y-2">
          {products.map((product) => (
            <CartListItem
              key={product.id}
              product={product}
              cart={cart}
              addToCart={addToCart}
            />
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">장바구니 내역</h2>
        <div className="space-y-2">
          {cart.map((item) => (
            <CartWithCoupon
              key={item.product.id}
              item={item}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
            />
          ))}
        </div>
        <CouponSelector
          coupons={coupons}
          applyCoupon={applyCoupon}
          selectedCoupon={selectedCoupon}
        />
        <Summary {...calculateTotal} />
      </div>
    </>
  );
};
