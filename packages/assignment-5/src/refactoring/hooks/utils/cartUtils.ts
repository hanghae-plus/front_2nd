import { CartItem, Coupon, Discount } from '../../../types';

const getSortedDiscounts = (discounts: Discount[]) => {
  return discounts.sort((a, b) => b.quantity - a.quantity);
};

const getDiscountRate = (discounts: Discount[], quantity: number) => {
  let discountRate = 0;
  for (const discount of discounts) {
    if (quantity >= discount.quantity) {
      discountRate = discount.rate;
      break;
    }
  }
  return discountRate;
};

export const calculateItemTotal = (item: CartItem) => {
  const { product, quantity } = item;
  const sortedDiscounts = getSortedDiscounts(product.discounts);
  const discountRate = getDiscountRate(sortedDiscounts, quantity);

  return product.price * quantity * (1 - discountRate);
};

export const getMaxApplicableDiscount = (item: CartItem) => {
  const {
    product: { discounts },
    quantity,
  } = item;
  let discountRate = 0;
  const sortedDiscounts = getSortedDiscounts(discounts);
  for (const discount of sortedDiscounts) {
    if (quantity >= discount.quantity) {
      discountRate = discount.rate;
      break;
    }
  }
  return discountRate;
};

const calculateTotalBeforeDiscount = (cart: CartItem[]) => {
  return cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
};

const calculateTotalAfterDiscount = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
) => {
  let totalAfterDiscount = cart.reduce(
    (acc, item) => acc + calculateItemTotal(item),
    0
  );

  if (selectedCoupon) {
    totalAfterDiscount = applyCoupon(totalAfterDiscount, selectedCoupon);
  }
  return totalAfterDiscount;
};

const applyCoupon = (total: number, coupon: Coupon) => {
  if (coupon?.discountType === 'amount') {
    total = total - coupon.discountValue;
  } else if (coupon?.discountType === 'percentage') {
    const discountRate = coupon.discountValue / 100;
    total = total * (1 - discountRate);
  }
  return total;
};
export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
) => {
  const totalBeforeDiscount = calculateTotalBeforeDiscount(cart);
  const totalAfterDiscount = calculateTotalAfterDiscount(cart, selectedCoupon);
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
  if (newQuantity <= 0) {
    return cart.filter((item) => item.product.id !== productId);
  }
  const newCart = cart.map((item) => {
    const {
      product: { id, stock },
    } = item;
    if (id === productId) {
      const updatedQuantity = stock >= newQuantity ? newQuantity : stock;
      return {
        ...item,
        quantity: updatedQuantity,
      };
    }
    return item;
  });
  return newCart;
};
