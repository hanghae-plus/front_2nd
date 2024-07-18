import { useStore } from 'zustand';
import { cartStore, couponStore } from '~entities';
import { useCalculateCartTotal } from '~pages/cart/cart-page.model';

export function CartCalculateTotalPrice() {
  const selectedCoupon = useStore(couponStore, (state) => state.selectedCoupon);
  const cartItems = useStore(cartStore, (state) => state.cartItems);
  const calculateCartTotal = useCalculateCartTotal(cartItems, selectedCoupon);

  return <CartCalculateTotalPriceView {...calculateCartTotal} />;
}

type CartCalculateTotalPriceViewProps = {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
  totalDiscount: number;
};

function CartCalculateTotalPriceView({
  totalBeforeDiscount,
  totalAfterDiscount,
  totalDiscount,
}: CartCalculateTotalPriceViewProps) {
  return (
    <div className="mt-6 bg-white p-4 rounded shadow">
      <h2 className="text-2xl font-semibold mb-2">주문 요약</h2>
      <div className="space-y-1">
        <p>상품 금액: {totalBeforeDiscount.toLocaleString()}원</p>
        <p className="text-green-600">
          할인 금액: {totalDiscount.toLocaleString()}원
        </p>
        <p className="text-xl font-bold">
          최종 결제 금액: {totalAfterDiscount.toLocaleString()}원
        </p>
      </div>
    </div>
  );
}
