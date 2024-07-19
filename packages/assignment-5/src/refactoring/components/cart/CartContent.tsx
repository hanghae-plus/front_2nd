import { CartItem, Coupon } from '../../../types.ts';
import { SelectedProductList } from './SelectedProductList';
import { CouponApplication } from './CouponApplication';
import { CartSummary } from './CartSummary';

interface Props {
  cart: CartItem[];
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  applyCoupon: (coupon: Coupon) => void;
  getAppliedDiscount: (item: CartItem) => number;
  calculateTotal: () => { totalDiscount: number; totalAfterDiscount: number; totalBeforeDiscount: number };
  selectedCoupon: Coupon | null;
  coupons: Coupon[];
}

export const CartContent = ({
  cart,
  removeFromCart,
  updateQuantity,
  applyCoupon,
  getAppliedDiscount,
  calculateTotal,
  selectedCoupon,
  coupons,
}: Props) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">장바구니 내역</h2>
      <SelectedProductList
        cart={cart}
        removeFromCart={removeFromCart}
        updateQuantity={updateQuantity}
        getAppliedDiscount={getAppliedDiscount}
      />
      <CouponApplication applyCoupon={applyCoupon} selectedCoupon={selectedCoupon} coupons={coupons} />
      <CartSummary calculateTotal={calculateTotal} />
    </div>
  );
};
