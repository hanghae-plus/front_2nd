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

export const getMaxApplicableDiscount = (item: CartItem) => {
  const { discounts } = item.product;

  if (discounts.length === 0) {
    return 0;
  }

  for (let index = 0; index < discounts.length; index++) {
    if (discounts[index].quantity > item.quantity) {
      return index === 0 ? 0 : discounts[index - 1].rate;
    }
  }

  return discounts[discounts.length - 1].rate;
};

export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
) => {
  const totalBeforeDiscount = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const totalBeforeCoupon = cart.reduce(
    (acc, item) => acc + calculateItemTotal(item),
    0
  );

  const totalAfterDiscount = selectedCoupon
    ? selectedCoupon.discountType === "amount"
      ? totalBeforeCoupon - selectedCoupon.discountValue
      : (totalBeforeCoupon * (100 - selectedCoupon.discountValue)) / 100
    : totalBeforeCoupon;

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
