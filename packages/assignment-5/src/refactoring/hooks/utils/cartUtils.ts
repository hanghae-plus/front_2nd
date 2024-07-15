import { CartItem, Coupon, Discount, Product } from "../../../types";

/**
 * 할인 없는 총액 계산
 * @param item
 * @returns 할인 전 가격
 */
export const calculateItemTotal = (item: CartItem) => {
  const itemPrice = item.product.price;

  const discountRate = getMaxApplicableDiscount(item);

  const price = itemPrice * item.quantity;

  if (!discountRate) {
    return price;
  }

  return price * (1 - discountRate);
};

/**
 *
 * @param item
 * @returns 개별 할인으로 얻을 수 있는 최대 할인율
 */
export const getMaxApplicableDiscount = (item: CartItem) => {
  const discountRate = item.product.discounts.reduce(
    (max, discount) =>
      item.quantity >= discount.quantity ? Math.max(max, discount.rate) : max,
    0
  );

  if (!discountRate) {
    return 0;
  }

  return discountRate;
};

/**
 * 할인 전 합계 금액, 할인 후 합계 금액, 총 할인금액 계산 함수
 * @param cart
 * @param selectedCoupon
 * @returns
 */
export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
) => {
  const { totalBeforeDiscount, totalAfterDiscount } = cart.reduce(
    (acc, item) => {
      const { price } = item.product;
      const { quantity } = item;

      acc.totalBeforeDiscount += price * quantity;

      const discount = item.product.discounts.reduce(
        (maxDiscount, d) =>
          quantity >= d.quantity && d.rate > maxDiscount ? d.rate : maxDiscount,
        0
      );

      acc.totalAfterDiscount += price * quantity * (1 - discount);

      return acc;
    },
    { totalBeforeDiscount: 0, totalAfterDiscount: 0 }
  );

  let totalDiscount = totalAfterDiscount;

  // 쿠폰 적용
  if (selectedCoupon) {
    if (selectedCoupon.discountType === "amount") {
      totalDiscount = Math.max(
        0,
        totalAfterDiscount - selectedCoupon.discountValue
      );
    } else {
      totalDiscount *= 1 - selectedCoupon.discountValue / 100;
    }
  }

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalDiscount),
    totalDiscount: Math.round(totalBeforeDiscount - totalDiscount),
  };
};

/**
 * cart아이템 수량을 변경하는 함수
 * @param cart
 * @param productId
 * @param newQuantity
 * @returns 업데이트 된 cartItem
 */
export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number
): CartItem[] => {
  return cart
    .map((item) => {
      if (item.product.id === productId) {
        const maxQuantity = item.product.stock;
        const updatedQuantity = Math.max(0, Math.min(newQuantity, maxQuantity));
        return updatedQuantity > 0
          ? { ...item, quantity: updatedQuantity }
          : null;
      }
      return item;
    })
    .filter((item) => item !== null);
};

/**
 * 남은 아이템 재고를 얻는 함수
 * @param product
 * @param cart
 * @returns 남은 재고
 */
export const getRemainingStock = (product: Product, cart: CartItem[]) => {
  const cartItem = cart.find((item) => item.product.id === product.id);
  return product.stock - (cartItem?.quantity || 0);
};

/**
 * 상품의 최대 할인율 계산 함수
 * @param discounts
 * @returns 최대할인율
 */
export const getMaxDiscount = (discounts: Discount[]) => {
  return discounts.reduce((max, discount) => Math.max(max, discount.rate), 0);
};
