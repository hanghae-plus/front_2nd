import { CartItem, Coupon } from "../../../types";

export const calculateItemTotal = (cartItem: CartItem) => {
  const { product, quantity } = cartItem;

  //TODO
  return product.price * quantity;
};

export const getMaxApplicableDiscount = (cartItem: CartItem) => {
  const { product, quantity } = cartItem;

  return product.discounts.reduce(
    (acc, discount) =>
      quantity >= discount.quantity ? Math.max(acc, discount.rate) : acc,
    0,
  );
};

export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null,
) => {
  const cartTotal = calculateTotalDiscount(cart);

  if (selectedCoupon) {
    cartTotal.totalDiscount = applyCouponDiscount(selectedCoupon, cartTotal);
  }

  const totalAfterDiscount =
    cartTotal.totalBeforeDiscount - cartTotal.totalDiscount;

  return {
    totalBeforeDiscount: cartTotal.totalBeforeDiscount,
    totalAfterDiscount,
    totalDiscount: cartTotal.totalDiscount,
  };
};

export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number,
): CartItem[] => {
  const updatedCart = cart.map((cartItem) =>
    cartItem.product.id === productId
      ? {
          ...cartItem,
          quantity: Math.max(0, Math.min(newQuantity, cartItem.product.stock)),
        }
      : cartItem,
  );

  return updatedCart.filter(({ quantity }) => quantity > 0);
};

const calculateTotalDiscount = (cart: CartItem[]) => {
  return cart.reduce(
    (acc, cartItem) => {
      const itemTotal = calculateItemTotal(cartItem);
      const discountRate = getMaxApplicableDiscount(cartItem);

      return {
        totalBeforeDiscount: acc.totalBeforeDiscount + itemTotal,
        totalDiscount: acc.totalDiscount + itemTotal * discountRate,
      };
    },
    {
      totalBeforeDiscount: 0,
      totalDiscount: 0,
    },
  );
};

const applyCouponDiscount = (selectedCoupon: Coupon, cartTotal) => {
  const { totalBeforeDiscount, totalDiscount } = cartTotal;
  let couponDiscount = 0;

  if (selectedCoupon.discountType === "percentage") {
    couponDiscount =
      (totalBeforeDiscount - totalDiscount) *
      (selectedCoupon.discountValue / 100);
  } else {
    couponDiscount = Math.min(
      totalBeforeDiscount - totalDiscount,
      selectedCoupon.discountValue,
    );
  }

  return totalDiscount + couponDiscount;
};
