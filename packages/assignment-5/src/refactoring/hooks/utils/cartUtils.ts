import type { CartItemType, Coupon } from "types";

// Item의 total을 계산하는 함수
export const calculateItemTotal = (item: CartItemType) => {
  const discount = getMaxApplicableDiscount(item);
  return discount > 0
    ? item.product.price * item.quantity * (1 - discount)
    : item.product.price * item.quantity;
};

export const getMaxApplicableDiscount = (item: CartItemType) => {
  return item.product.discounts.reduce((max, discount) => {
    if (item.quantity >= discount.quantity) {
      return Math.max(max, discount.rate);
    }
    return max;
  }, 0);
};

const calculateCouponDiscountPrice = (
  discountPrice: number,
  coupon: Coupon,
  totalBeforeDiscount: number,
) => {
  if (coupon.discountType === "amount") {
    return discountPrice + coupon.discountValue;
  } else {
    return (
      discountPrice +
      ((totalBeforeDiscount - discountPrice) * coupon.discountValue) / 100
    );
  }
};

export const calculateCartTotal = (
  cart: CartItemType[],
  selectedCoupon: Coupon | null,
) => {
  const totalBeforeDiscount = cart.reduce((total, item) => {
    return total + item.product.price * item.quantity;
  }, 0);

  const nonCouponDiscountPrice = cart.reduce((total, item) => {
    const discount = getMaxApplicableDiscount(item);
    return total + item.product.price * item.quantity * discount;
  }, 0);

  const totalDiscount = selectedCoupon
    ? calculateCouponDiscountPrice(
        nonCouponDiscountPrice,
        selectedCoupon,
        totalBeforeDiscount,
      )
    : nonCouponDiscountPrice;

  return {
    totalBeforeDiscount,
    totalAfterDiscount: totalBeforeDiscount - totalDiscount,
    totalDiscount,
  };
};

export const updateCartItemQuantity = (
  cartList: CartItemType[],
  productId: string,
  newQuantity: number,
): CartItemType[] => {
  if (newQuantity === 0) {
    return cartList.filter((cart) => cart.product.id !== productId);
  }
  return cartList.map((cart) => {
    if (cart.product.id === productId) {
      const quantity = Math.min(newQuantity, cart.product.stock);
      return { ...cart, quantity: quantity };
    }
    return cart;
  });
};
