import CartDetails from './components/cartDetails';
import ProductList from './components/productList';
import { useCart } from './hooks/useCart';

const CartPage = () => {
  const { cart, addToCart, removeFromCart, updateQuantity, applyCoupon, calculateTotal, selectedCoupon } = useCart();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">장바구니</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">상품 목록</h2>
          <ProductList cart={cart} addToCart={addToCart} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">장바구니 내역</h2>
          <CartDetails />
        </div>
      </div>
    </div>
  );
};

export default CartPage;
