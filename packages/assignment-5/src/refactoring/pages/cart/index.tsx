import { useCart } from './hooks/useCart';
import { useProducts, useCoupons } from '../../common/hooks';
import ShoppingProductList from './components/ShoppingProductList';
import CartItemList from './components/CartItemList';
import CouponSelector from './components/CouponSelector';
import CartSummary from './components/CartSummary';

export const CartPage = () => {
  const { products } = useProducts();
  const { coupons } = useCoupons();
  const { cart, addToCart, removeFromCart, updateQuantity, applyCoupon, calculateTotal, selectedCoupon } = useCart();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">장바구니</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">상품 목록</h2>
          <ShoppingProductList products={products} cart={cart} addToCart={addToCart} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">장바구니 내역</h2>
          <CartItemList cartItems={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />
          <CouponSelector coupons={coupons} applyCoupon={applyCoupon} selectedCoupon={selectedCoupon} />
          <CartSummary calculateTotal={calculateTotal} />
        </div>
      </div>
    </div>
  );
};
