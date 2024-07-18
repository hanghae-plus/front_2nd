import { CartItem, Coupon, Product } from "@/types";

export const getAppliedDiscountRate = (item: CartItem) => {
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

export const getMaxDiscount = (product: Product) =>
  product.discounts.reduce((max, discount) => Math.max(max, discount.rate), 0);

export const getRemainingStock = (cart: CartItem[], product: Product) => {
  const cartItem = cart.find((item) => item.product.id === product.id);
  return product.stock - (cartItem?.quantity || 0);
};

export const calculateItemTotal = (item: CartItem) => {
  const discountRate = getMaxApplicableDiscount(item);
  const totalPrice = item.product.price * item.quantity;

  return totalPrice * (1 - discountRate);
};

export const getMaxApplicableDiscount = (item: CartItem) =>
  item.product.discounts.reduce(
    (maxRate, discount) =>
      Math.max(maxRate, discount.quantity <= item.quantity ? discount.rate : 0),
    0
  );

export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
) => {
  const [totalBeforeDiscount, totalBeforeCoupon] = cart.reduce(
    ([a, b], item) => [
      a + item.product.price * item.quantity,
      b + calculateItemTotal(item),
    ],
    [0, 0]
  );

  let totalAfterDiscount = totalBeforeCoupon;
  if (selectedCoupon) {
    const { discountValue, discountType } = selectedCoupon;
    totalAfterDiscount = COUPON_CALLBACK[discountType](
      totalBeforeCoupon,
      discountValue
    );
  }

  const totalDiscount = totalBeforeDiscount - totalAfterDiscount;

  return {
    totalBeforeDiscount,
    totalAfterDiscount,
    totalDiscount,
  };
};

const COUPON_CALLBACK = {
  amount: (totalBeforeCoupon: number, discountValue: number) =>
    totalBeforeCoupon - discountValue,
  percentage: (totalBeforeCoupon: number, discountValue: number) =>
    (totalBeforeCoupon * (100 - discountValue)) / 100,
};

export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number
): CartItem[] => {
  const targetProductIndex = cart.findIndex(
    (item) => item.product.id === productId
  );

  if (targetProductIndex < 0) {
    return cart;
  }

  const newCart = [...cart];

  if (newQuantity === 0) {
    newCart.splice(targetProductIndex, 1);
  } else {
    const { stock } = newCart[targetProductIndex].product;

    newCart[targetProductIndex].quantity = Math.min(stock, newQuantity);
  }

  return newCart;
};
