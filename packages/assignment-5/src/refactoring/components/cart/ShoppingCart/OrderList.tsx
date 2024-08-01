import { useCartContext } from "provider/cart/useCartContext";
import { useCouponContext } from "provider/coupon/useCouponContext";

const OrderList = () => {
  const { calculateTotal, cartList } = useCartContext();
  const { selectedCoupon } = useCouponContext();

  const { totalBeforeDiscount, totalAfterDiscount, totalDiscount } =
    calculateTotal(cartList, selectedCoupon);

  return (
    <div className="mt-6 bg-white p-4 rounded shadow">
      <h2 className="text-2xl font-semibold mb-2">주문 요약</h2>
      <div className="space-y-1">
        <p data-testid="total-before-discount">
          상품 금액: {totalBeforeDiscount.toLocaleString()}원
        </p>
        <p data-testid="total-discount" className="text-green-600">
          할인 금액: {totalDiscount.toLocaleString()}원
        </p>
        <p data-testid="total-after-discount" className="text-xl font-bold">
          최종 결제 금액: {totalAfterDiscount.toLocaleString()}원
        </p>
      </div>
    </div>
  );
};

export default OrderList;
