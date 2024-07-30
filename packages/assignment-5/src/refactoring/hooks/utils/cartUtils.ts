import { CartItem, Coupon } from "../../../types";

export const calculateItemTotal = (cartItem: CartItem) => {
  const { product, quantity } = cartItem;
  const discount = getMaxApplicableDiscount(cartItem);

  return product.price * quantity * (1 - discount);
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
    cartTotal.totalAfterDiscount = applyCouponDiscount(
      selectedCoupon,
      cartTotal.totalAfterDiscount,
    );
  }

  const totalDiscount =
    cartTotal.totalBeforeDiscount - cartTotal.totalAfterDiscount;

  return {
    totalBeforeDiscount: Math.round(cartTotal.totalBeforeDiscount),
    totalAfterDiscount: Math.round(cartTotal.totalAfterDiscount),
    totalDiscount: Math.round(totalDiscount),
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
      const { product, quantity } = cartItem;

      return {
        totalBeforeDiscount: acc.totalBeforeDiscount + product.price * quantity,
        totalAfterDiscount: acc.totalAfterDiscount + itemTotal,
      };
    },
    {
      totalBeforeDiscount: 0,
      totalAfterDiscount: 0,
    },
  );
};

const applyCouponDiscount = (selectedCoupon: Coupon, totalAfterDiscount) => {
  const couponDiscount =
    DISCOUNT_TYPE[selectedCoupon.discountType]?.(
      selectedCoupon,
      totalAfterDiscount,
    ) ?? 0;

  return couponDiscount;
};

const calculatePercentage = (selectedCoupon, totalAfterDiscount) => {
  return totalAfterDiscount * (1 - selectedCoupon.discountValue / 100);
};

const calculateAmount = (selectedCoupon, totalAfterDiscount) => {
  return Math.max(0, totalAfterDiscount - selectedCoupon.discountValue);
};

const DISCOUNT_TYPE = {
  percentage: calculatePercentage,
  amount: calculateAmount,
};
