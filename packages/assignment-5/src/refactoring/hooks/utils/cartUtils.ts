import { CartItem, Coupon } from "../../../types";

export const calculateItemTotal = (item: CartItem) => {
  return 0;
};

export const getMaxApplicableDiscount = (item: CartItem) => {
  return 0;
};

export const calculateCartTotal = (cart: CartItem[], selectedCoupon: Coupon | null) => {
  return {
    totalBeforeDiscount: 0,
    totalAfterDiscount: 0,
    totalDiscount: 0,
  };
};

export const updateCartItemQuantity = (cart: CartItem[], productId: string, newQuantity: number): CartItem[] => {
  return []
};
