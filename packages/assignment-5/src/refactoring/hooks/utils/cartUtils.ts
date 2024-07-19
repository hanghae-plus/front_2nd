import { CartItem, Coupon, Product } from "../../types";
import {
  DISCOUNT_TYPES,
  MIN_QUANTITY,
  PERCENTAGE_BASE,
} from "../../components/constants";

export const calculateItemTotal = (item: CartItem): number => {
  const { product, quantity } = item;
  const discount = getMaxApplicableDiscount(item);
  return product.price * quantity * (1 - discount);
};

export const getMaxApplicableDiscount = (item: CartItem): number => {
  const { product, quantity } = item;
  let maxDiscount = 0;
  for (const discount of product.discounts) {
    if (quantity >= discount.quantity) {
      maxDiscount = Math.max(maxDiscount, discount.rate);
    }
  }
  return maxDiscount;
};

export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
) => {
  let totalBeforeDiscount = 0;
  let totalDiscount = 0;

  for (const item of cart) {
    const itemTotal = calculateItemTotal(item);
    totalBeforeDiscount += item.product.price * item.quantity;
    totalDiscount += item.product.price * item.quantity - itemTotal;
  }

  let couponDiscount = 0;
  if (selectedCoupon) {
    if (selectedCoupon.discountType === DISCOUNT_TYPES.AMOUNT) {
      couponDiscount = selectedCoupon.discountValue;
    } else {
      const totalAfterItemDiscounts = totalBeforeDiscount - totalDiscount;
      couponDiscount = Math.floor(
        totalAfterItemDiscounts *
          (selectedCoupon.discountValue / PERCENTAGE_BASE)
      );
    }
  }

  totalDiscount += couponDiscount;
  const totalAfterDiscount = Math.max(totalBeforeDiscount - totalDiscount, 0);

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
  return cart
    .map((item) => {
      if (item.product.id === productId) {
        const updatedQuantity = Math.min(newQuantity, item.product.stock);
        return updatedQuantity > MIN_QUANTITY
          ? { ...item, quantity: updatedQuantity }
          : null;
      }
      return item;
    })
    .filter((item): item is CartItem => item !== null);
};

export const calculateDiscountedPrice = (
  price: number,
  discount: number
): number => {
  return price * (1 - discount);
};
