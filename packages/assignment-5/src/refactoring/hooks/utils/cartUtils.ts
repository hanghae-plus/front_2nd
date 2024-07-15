import { CartItem, Coupon, Product } from "../../../types";

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
 *
 * @param cart
 * @param selectedCoupon
 * @returns
 */
export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
) => {
  let totalBeforeDiscount = 0;
  let totalAfterDiscount = 0;

  cart.forEach((item) => {
    const { price } = item.product;
    const { quantity } = item;
    totalBeforeDiscount += price * quantity;

    const discount = item.product.discounts.reduce((maxDiscount, d) => {
      return quantity >= d.quantity && d.rate > maxDiscount
        ? d.rate
        : maxDiscount;
    }, 0);

    totalAfterDiscount += price * quantity * (1 - discount);
  });

  let totalDiscount = totalBeforeDiscount - totalAfterDiscount;

  // 쿠폰 적용
  if (selectedCoupon) {
    if (selectedCoupon.discountType === "amount") {
      totalAfterDiscount = Math.max(
        0,
        totalAfterDiscount - selectedCoupon.discountValue
      );
    } else {
      totalAfterDiscount *= 1 - selectedCoupon.discountValue / 100;
    }
    totalDiscount = totalBeforeDiscount - totalAfterDiscount;
  }

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
    totalDiscount: Math.round(totalDiscount),
  };
};

/**
 *
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
 * 남은 잔고를 확인하는 함수
 * @param product
 * @param cart
 * @returns 할인율
 */
export const getRemainingStock = (product: Product, cart: CartItem[]) => {
  const cartItem = cart.find((item) => item.product.id === product.id);
  return product.stock - (cartItem?.quantity || 0);
};

/**
 *
 * @param discounts
 * @returns 최대할인율
 */
export const getMaxDiscount = (
  discounts: { quantity: number; rate: number }[]
) => {
  return discounts.reduce((max, discount) => Math.max(max, discount.rate), 0);
};
