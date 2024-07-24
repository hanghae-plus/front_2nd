import { CartItem } from '~entities/cart';
import { Coupon } from '~entities/coupon';

export const calculateItemTotal = (cartItem: CartItem) => {
  const { product, quantity } = cartItem;

  const totalPrice = product.price * quantity;
  const quantityDiscount = getMaxApplicableDiscount(cartItem);

  return totalPrice * (1 - quantityDiscount);
};

export const getMaxApplicableDiscount = (cartItem: CartItem) => {
  const { product, quantity } = cartItem;

  const maxApplicableDiscount = product.discounts.reduce(
    (maxDiscount, currentDiscount) => {
      if (quantity >= currentDiscount.quantity) {
        return Math.max(maxDiscount, currentDiscount.rate);
      } else {
        return maxDiscount;
      }
    },
    0
  );

  return maxApplicableDiscount;
};

export const useCalculateCartTotal = (
  cartItems: CartItem[],
  selectedCoupon: Coupon | null
) => {
  const cartTotalPrice = cartItems.reduce((sumCartPrice, currentCartItem) => {
    sumCartPrice += currentCartItem.product.price * currentCartItem.quantity;
    return sumCartPrice;
  }, 0);

  const quantityDiscount = cartItems.reduce((sumCartDiscount, currentItem) => {
    const discount = getMaxApplicableDiscount(currentItem);
    sumCartDiscount +=
      currentItem.product.price * currentItem.quantity * discount;
    return sumCartDiscount;
  }, 0);

  let couponDiscount = 0;
  if (selectedCoupon) {
    if (selectedCoupon.discountType === 'amount') {
      couponDiscount = selectedCoupon.discountValue;
    } else {
      couponDiscount =
        ((cartTotalPrice - quantityDiscount) * selectedCoupon.discountValue) /
        100;
    }
  }

  const calculateTotalPrice =
    cartTotalPrice - quantityDiscount - couponDiscount;

  return {
    totalBeforeDiscount: cartTotalPrice,
    totalAfterDiscount: calculateTotalPrice,
    totalDiscount: quantityDiscount + couponDiscount,
  };
};
