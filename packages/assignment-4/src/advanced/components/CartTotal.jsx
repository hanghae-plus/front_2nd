import { DEFAULT_DISCOUNT_RATE } from '../constants';

export default function CartTotal({ discountRate, cartTotal }) {
  function getTotal() {
    return Math.round(
      discountRate > DEFAULT_DISCOUNT_RATE
        ? cartTotal * (1 - discountRate)
        : cartTotal
    );
  }

  function getDiscountRate() {
    return (discountRate * 100).toFixed(1);
  }

  return (
    <div id="cart-total" className="text-xl font-bold my-4">
      {`총액: ${getTotal()}원`}
      {discountRate > DEFAULT_DISCOUNT_RATE && (
        <span className="text-green-500 ml-2">{`(${getDiscountRate()}% 할인 적용)`}</span>
      )}
    </div>
  );
}
