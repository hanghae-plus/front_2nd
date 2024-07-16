import { Coupon, Product } from "../../types.ts";
import { useCart } from "../hooks";
import {
  getMaxApplicableDiscount,
  getRemainingStock,
} from "../hooks/utils/cartUtils.ts";
import CartItemList from "./CartItemList.tsx";
import ProductList from "./ProductList.tsx";

interface Props {
  products: Product[];
  coupons: Coupon[];
}

export const CartPage = ({ products, coupons }: Props) => {
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateTotal,
    selectedCoupon,
  } = useCart();

  const { totalBeforeDiscount, totalAfterDiscount, totalDiscount } =
    calculateTotal;

  // const changeQuantityHandler = (productId: string, newQuantity: number) => {
  //   updateQuantity(productId, newQuantity);
  // };

  /**
   * discountType에 따라 %할인일지 금액할인일지 계산하는 함수
   * @param coupon
   * @returns 할인 value
   */
  const discountCouponValue = (coupon: Coupon) => {
    return coupon.discountType === "amount"
      ? `${coupon.discountValue}원`
      : `${coupon.discountValue}%`;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">장바구니</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">상품 목록</h2>
          <div className="space-y-2">
            {products.map((product) => {
              const remainStock = getRemainingStock(product, cart);
              return (
                <ProductList
                  product={product}
                  remainStock={remainStock}
                  addToCart={addToCart}
                />
              );
            })}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">장바구니 내역</h2>

          <div className="space-y-2">
            {cart.map((item) => {
              const maxDiscountRate = getMaxApplicableDiscount(item);
              return (
                <CartItemList
                  item={item}
                  appliedDiscountRate={maxDiscountRate}
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
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
                  {coupon.name} - {discountCouponValue(coupon)}
                </option>
              ))}
            </select>
            {selectedCoupon && (
              <p className="text-green-600">
                적용된 쿠폰: {selectedCoupon.name}(
                {discountCouponValue(selectedCoupon)} 할인)
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
      </div>
    </div>
  );
};
