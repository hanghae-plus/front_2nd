import { CartItem, Coupon } from "../../../types";

export const calculateItemTotal = (item: CartItem) => {
  const baseTotal = item.product.price * item.quantity;
  const discountRate = getMaxApplicableDiscount(item);
  return baseTotal * (1 - discountRate);
};

export const getMaxApplicableDiscount = (item: CartItem) => {
  if (!item.product.discounts || item.product.discounts.length === 0) {
    return 0;
  }

  const applicableDiscounts = item.product.discounts.filter(
    (discount) => item.quantity >= discount.quantity
  );

  if (applicableDiscounts.length === 0) {
    return 0;
  }

  const maxDiscountRate = applicableDiscounts.reduce(
    (maxRate, discount) => Math.max(maxRate, discount.rate),
    0
  );

  return maxDiscountRate;
};

const applyCoupon = (price: number, coupon: Coupon | null) => {
  if (!coupon) {
    return price;
  }
  if (coupon.discountType === "amount") {
    return price - coupon.discountValue;
  }
  return price * (1 - coupon.discountValue / 100);
};

export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
) => {
  const totalBeforeDiscount = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const totalAfterDiscount = applyCoupon(
    cart.reduce((acc, item) => acc + calculateItemTotal(item), 0),
    selectedCoupon
  );
  const totalDiscount = totalBeforeDiscount - totalAfterDiscount;
  return {
    totalBeforeDiscount,
    totalAfterDiscount,
    totalDiscount,
  };
};

export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number
): CartItem[] => {
  if (newQuantity < 0) {
    throw new Error("업데이트 할 수량은 0 이상이어야 합니다.");
  }

  if (newQuantity === 0) {
    return cart.filter((item) => item.product.id !== productId);
  }

  return cart.map((item) => {
    if (item.product.id === productId) {
      const updatedQuantity = Math.min(newQuantity, item.product.stock);
      return { ...item, quantity: updatedQuantity };
    }
    return item;
  });
};
