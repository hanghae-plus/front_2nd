import { CartItem, Coupon } from "../../types.ts";

export const calculateItemTotal = (item: CartItem) => {
  return (
    item.product.price * item.quantity * (1 - getMaxApplicableDiscount(item))
  );
};

export const calculateItemDiscount = (item: CartItem) => {
  return item.product.price * item.quantity * getMaxApplicableDiscount(item);
};

export const getMaxApplicableDiscount = (item: CartItem) => {
  return item.product.discounts.reduce(
    (acc, { rate, quantity }) =>
      item.quantity >= quantity ? Math.max(acc, rate) : acc,
    0,
  );
};

export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null,
) => {
  const totalBeforeDiscount = cart.reduce(
    (acc, curr) => acc + curr.quantity * curr.product.price,
    0,
  );

  const totalCartItemDiscount = cart.reduce(
    (acc, curr) => acc + calculateItemDiscount(curr),
    0,
  );

  const selectedCouponDiscount =
    selectedCoupon === null
      ? 0
      : selectedCoupon.discountType === "amount"
        ? selectedCoupon.discountValue
        : ((totalBeforeDiscount - totalCartItemDiscount) *
            selectedCoupon.discountValue) /
          100;

  const totalDiscount = totalCartItemDiscount + selectedCouponDiscount;

  const totalAfterDiscount = totalBeforeDiscount - totalDiscount;

  return {
    totalBeforeDiscount,
    totalDiscount,
    totalAfterDiscount,
  };
};

export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number,
): CartItem[] => {
  return cart.reduce((acc, curr) => {
    if (curr.product.id !== productId) {
      return acc.concat(curr);
    }
    if (newQuantity === 0) {
      return acc;
    }
    return acc.concat({
      ...curr,
      quantity: Math.min(newQuantity, curr.product.stock),
    });
  }, [] as CartItem[]);
};
