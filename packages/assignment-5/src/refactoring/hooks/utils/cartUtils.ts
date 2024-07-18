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

const calculateCouponDiscount = (
  selectedCoupon: Coupon,
  totalBeforeDiscount: number,
  QuantityDiscount: number,
) => {
  const { discountType, discountValue } = selectedCoupon;
  if (discountType === AMOUNT) {
    return discountValue;
  }
  if (discountType === PERCENTAGE) {
    return ((totalBeforeDiscount - QuantityDiscount) * discountValue) / 100;
  }
  return 0;
};

export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null,
) => {
  const totalBeforeDiscount = cart.reduce(
    (pre, cur) => pre + calculateItemTotal(cur),
    0,
  );
  let totalDiscount = cart
    .map(
      (item) =>
        getMaxApplicableDiscount(item) * item.product.price * item.quantity,
    )
    .reduce((pre, cur) => pre + cur, 0);

  if (selectedCoupon) {
    totalDiscount += calculateCouponDiscount(
      selectedCoupon,
      totalBeforeDiscount,
      totalDiscount,
    );
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

export const getAppliedDiscount = (item: CartItem) => {
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
