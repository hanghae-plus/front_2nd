import type { Coupon, Product } from "types";
import ShoppingCart from "refactoring/components/cart/ShoppingCart/index.tsx";
import CartList from "refactoring/components/cart/ProductList";
import { useCart } from "hooks/useCart";

interface CartPageProps {
  products: Product[];
  coupons: Coupon[];
}

export const CartPage = ({ products, coupons }: CartPageProps) => {
  const {
    cartList,
    addToCart,
    selectedCoupon,
    calculateTotal,
    applyCoupon,
    updateQuantity,
    removeFromCart,
  } = useCart();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">장바구니</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CartList cartList={cartList} addToCart={addToCart}>
          <CartList.ProductList>
            {products.map((product) => (
              <CartList.ProductItem key={product.id} product={product} />
            ))}
          </CartList.ProductList>
        </CartList>
        <ShoppingCart
          cartList={cartList}
          coupons={coupons}
          applyCoupon={applyCoupon}
          selectedCoupon={selectedCoupon}
          calculateTotal={calculateTotal}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
        />
      </div>
    </div>
  );
};
