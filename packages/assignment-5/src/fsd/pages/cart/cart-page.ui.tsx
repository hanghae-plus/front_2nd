import { useStore } from 'zustand';
import {
  CartItem,
  cartStore,
  couponStore,
  productStore,
  type Coupon,
  type Product,
} from '~entities';
import {
  CartCalculateTotalPrice,
  CartUpdateForm,
  CouponApply,
  ProductList,
} from '~features';

export const CartPage = () => {
  const products = useStore(productStore, (state) => state.products);

  const { coupons, selectedCoupon } = useStore(couponStore, (state) => ({
    selectedCoupon: state.selectedCoupon,
    coupons: state.coupons,
  }));

  const cartItems = useStore(cartStore, (state) => state.cartItems);

  const props: CartPageViewProps = {
    products: products,
    cartItems: cartItems,
    coupons: coupons,
    selectedCoupon: selectedCoupon,
  };

  return <CartPageView {...props} />;
};

type CartPageViewProps = {
  products: Product[];
  cartItems: CartItem[];
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
};

function CartPageView({
  products,
  coupons,
  cartItems,
  selectedCoupon,
}: CartPageViewProps) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">장바구니</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">상품 목록</h2>
          <div className="space-y-2">
            {products.map((product) => (
              <ProductList key={product.id} product={product} />
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">장바구니 내역</h2>
          <div className="space-y-2">
            {cartItems.map((cartItem) => (
              <CartUpdateForm key={cartItem.product.id} cartItem={cartItem} />
            ))}
          </div>
          <CouponApply coupons={coupons} selectedCoupon={selectedCoupon} />
          <CartCalculateTotalPrice />
        </div>
      </div>
    </div>
  );
}
