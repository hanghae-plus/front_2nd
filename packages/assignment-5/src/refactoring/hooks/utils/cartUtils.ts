import { CartItem, Coupon, Product } from '../../../types';
import { AMOUNT, INIT_QUANTITY, PERCENTAGE } from '../../constants';

export const getCartItem = (cart: CartItem[], product: Product) => {
  const cartItem = cart.find((item) => item.product.id === product.id);
  return cartItem ? cartItem : { product, quantity: INIT_QUANTITY };
};

export const calculateItemTotal = (item: CartItem) => {
  return item.product.price * item.quantity;
};

export const getMaxApplicableDiscount = (item: CartItem) => {
  return item.product.discounts.reduce(
    (pre, cur) => (item.quantity >= cur.quantity ? cur.rate : pre),
    0,
  );
};

export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null,
) => {
  const totalBeforeDiscount = cart.reduce(
    (pre, cur) => pre + cur.product.price * cur.quantity,
    0,
  );
  let totalDiscount = cart
    .map(
      (item) =>
        getMaxApplicableDiscount(item) * item.product.price * item.quantity,
    )
    .reduce((pre, cur) => pre + cur, 0);

  if (selectedCoupon) {
    if (selectedCoupon.discountType === AMOUNT) {
      totalDiscount += selectedCoupon.discountValue;
    }
    if (selectedCoupon.discountType === PERCENTAGE) {
      totalDiscount +=
        ((totalBeforeDiscount - totalDiscount) * selectedCoupon.discountValue) /
        100;
    }
  }

  const totalAfterDiscount = totalBeforeDiscount - totalDiscount;

  return {
    totalBeforeDiscount,
    totalAfterDiscount,
    totalDiscount,
  };
};

export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number,
): CartItem[] => {
  return cart
    .map((item) => {
      if (item.product.id === productId) {
        item.quantity = newQuantity;
      }
      if (newQuantity > item.product.stock) {
        item.quantity = item.product.stock;
      }
      return item;
    })
    .filter((item) => item.quantity > 0);
};
