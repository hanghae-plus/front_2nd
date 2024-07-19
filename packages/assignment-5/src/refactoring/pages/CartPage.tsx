import { Coupon, Product } from '../../types.ts';
import { useCart } from '../hooks';
import { ProductList } from '../components/cart/ProductList';
import { CartContent } from '../components/cart/CartContent';

interface Props {
  products: Product[];
  coupons: Coupon[];
}

export const CartPage = ({ products, coupons }: Props) => {
  const {
    cart,
    addToCart,
    getRemainingStock,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    getMaxDiscount,
    getAppliedDiscount,
    calculateTotal,
    selectedCoupon,
  } = useCart();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">장바구니</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProductList
          addToCart={addToCart}
          getRemainingStock={getRemainingStock}
          getMaxDiscount={getMaxDiscount}
          products={products}
        />
        <CartContent
          cart={cart}
          removeFromCart={removeFromCart}
          updateQuantity={updateQuantity}
          applyCoupon={applyCoupon}
          getAppliedDiscount={getAppliedDiscount}
          calculateTotal={calculateTotal}
          selectedCoupon={selectedCoupon}
          coupons={coupons}
        />
      </div>
    </div>
  );
};
