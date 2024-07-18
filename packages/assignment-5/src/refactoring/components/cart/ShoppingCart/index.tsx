import type { CartItemType, Coupon } from "types";
import CartItem from "./CartItem";

interface ShoppingCartProps {
  cartList: CartItemType[];
  coupons: Coupon[];
  calculateTotal: () => {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
    totalDiscount: number;
  };
  selectedCoupon: Coupon | null;
  applyCoupon: (coupon: Coupon) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
}

const ShoppingCart = ({
  coupons,
  applyCoupon,
  calculateTotal,
  selectedCoupon,
  cartList,
  removeFromCart,
  updateQuantity,
}: ShoppingCartProps) => {
  const { totalBeforeDiscount, totalAfterDiscount, totalDiscount } =
    calculateTotal();

  const getAppliedDiscount = (item: CartItemType) => {
    const { discounts } = item.product;
    const { quantity } = item;
    let appliedDiscount = 0;
    for (const discount of discounts) {
      if (quantity >= discount.quantity) {
        appliedDiscount = Math.max(appliedDiscount, discount.rate);
      }
    }
    return appliedDiscount;
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">장바구니 내역</h2>

      <div className="space-y-2">
        {cartList.map((cart) => {
          const appliedDiscount = getAppliedDiscount(cart);
          return (
            <CartItem
              cart={cart}
              appliedDiscount={appliedDiscount}
              removeFromCart={removeFromCart}
              updateQuantity={updateQuantity}
              key={cart.product.id}
            />
          );
        })}
      </div>

      <div className="mt-6 bg-white p-4 rounded shadow">
        <h2 className="text-2xl font-semibold mb-2">쿠폰 적용</h2>
        <select
          onChange={(e) => applyCoupon(coupons[parseInt(e.target.value)])}
          className="w-full p-2 border rounded mb-2"
        >
          <option value="">쿠폰 선택</option>
          {coupons.map((coupon, index) => (
            <option key={coupon.code} value={index}>
              {coupon.name} -{" "}
              {coupon.discountType === "amount"
                ? `${coupon.discountValue}원`
                : `${coupon.discountValue}%`}
            </option>
          ))}
        </select>
        {selectedCoupon && (
          <p className="text-green-600">
            적용된 쿠폰: {selectedCoupon.name}(
            {selectedCoupon.discountType === "amount"
              ? `${selectedCoupon.discountValue}원`
              : `${selectedCoupon.discountValue}%`}{" "}
            할인)
          </p>
        )}
      </div>

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
    </div>
  );
};

export default ShoppingCart;
