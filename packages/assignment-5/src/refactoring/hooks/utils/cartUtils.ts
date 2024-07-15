import type { CartItemType, Coupon } from "types";

export const calculateItemTotal = (item: CartItemType): number => {
  const discount = getMaxApplicableDiscount(item);
  return discount > 0
    ? item.product.price * item.quantity * (1 - discount)
    : item.product.price * item.quantity;
};

export const getAppliedDiscount = (item: CartItemType): number => {
  const { discounts } = item.product;

  return discounts.reduce(
    (maxDiscount, discount) =>
      item.quantity >= discount.quantity
        ? Math.max(maxDiscount, discount.rate)
        : maxDiscount,
    0,
  );
};

export const getMaxApplicableDiscount = (item: CartItemType): number => {
  return item.product.discounts.reduce((max, discount) => {
    if (item.quantity >= discount.quantity) {
      return Math.max(max, discount.rate);
    }
    return max;
  }, 0);
};

interface CalculateCouponDiscountPriceProps {
  discountPrice: number;
  coupon: Coupon;
  totalBeforeDiscount: number;
}

export const calculateCouponDiscountPrice = ({
  discountPrice,
  coupon,
  totalBeforeDiscount,
}: CalculateCouponDiscountPriceProps): number => {
  if (coupon.discountType === "amount") {
    return discountPrice + coupon.discountValue;
  }

  if (coupon.discountType === "percentage") {
    return (
      discountPrice +
      (totalBeforeDiscount - discountPrice) * (coupon.discountValue / 100)
    );
  }

  return discountPrice;
};

interface CalculateCartTotalProps {
  cart: CartItemType[];
  selectedCoupon: Coupon | null;
}

export const calculateCartTotal = ({
  cart,
  selectedCoupon,
}: CalculateCartTotalProps) => {
  const totalBeforeDiscount = cart.reduce((total, item) => {
    return total + item.product.price * item.quantity;
  }, 0);

  const nonCouponDiscountPrice = cart.reduce((total, item) => {
    const discount = getMaxApplicableDiscount(item);
    return total + item.product.price * item.quantity * discount;
  }, 0);

  const totalDiscount = selectedCoupon
    ? calculateCouponDiscountPrice({
        discountPrice: nonCouponDiscountPrice,
        coupon: selectedCoupon,
        totalBeforeDiscount,
      })
    : nonCouponDiscountPrice;

  return {
    totalBeforeDiscount,
    totalAfterDiscount: totalBeforeDiscount - totalDiscount,
    totalDiscount,
  };
};

interface UpdateCartItemQuantityProps {
  cartList: CartItemType[];
  productId: string;
  newQuantity: number;
}

export const updateCartItemQuantity = ({
  cartList,
  productId,
  newQuantity,
}: UpdateCartItemQuantityProps) => {
  if (newQuantity < 1) {
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
