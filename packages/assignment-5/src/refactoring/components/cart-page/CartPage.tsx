import { Coupon, Product } from '../../../types.ts';
import { ProductList, CartList, CouponSelector, OrderSummary } from "./parts";
import { useCart } from "./hooks";

interface Props {
  products: Product[];
  coupons: Coupon[];
}

// Main CartPage component
export const CartPage = ({ products, coupons }: Props) => {
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateTotal,
    selectedCoupon
  } = useCart();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">장바구니</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">상품 목록</h2>
          <ProductList
            cart={cart}
            products={products}
            addToCart={addToCart}
          />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">장바구니 내역</h2>
          <CartList
            cart={cart}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
          />
          <CouponSelector
            coupons={coupons}
            applyCoupon={applyCoupon}
            selectedCoupon={selectedCoupon}
          />
          <OrderSummary{...calculateTotal()}/>
        </div>
      </div>
    </div>
  );
};
