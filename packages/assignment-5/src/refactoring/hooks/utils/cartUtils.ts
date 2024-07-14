import type { CartItem, Coupon } from '../../../types';

export const calculateItemTotal = ({ product, quantity }: CartItem) => {
  const discountRate = getMaxApplicableDiscount({ product, quantity });
  return product.price * quantity * (1 - discountRate);
};

// 할인 적용 가능한 최대 할인율을 반환하되, 할인이 적용되지 않는 경우 0을 반환합니다.
export const getMaxApplicableDiscount = ({
  product: { discounts },
  quantity,
}: CartItem) => {
  return discounts
    .filter((discount) => quantity >= discount.quantity)
    .reduce((maxDiscountRate, discount) => {
      return Math.max(maxDiscountRate, discount.rate);
    }, 0);
};

interface CalculateCartTotal {
  cart: CartItem[];
  selectedCoupon: Coupon | null;
}

export const calculateCartTotal = ({
  cart,
  selectedCoupon,
}: CalculateCartTotal) => {
  const totalBeforeDiscount = cart.reduce((sum, cartItem) => {
    return sum + cartItem.product.price * cartItem.quantity;
  }, 0);
  const totalAfterDiscountWithoutCoupon = cart.reduce((sum, cartItem) => {
    return sum + calculateItemTotal(cartItem);
  }, 0);
  if (!selectedCoupon) {
    return {
      totalBeforeDiscount,
      totalAfterDiscount: totalAfterDiscountWithoutCoupon,
      totalDiscount: totalBeforeDiscount - totalAfterDiscountWithoutCoupon,
    };
  }
  const totalAfterDiscount =
    selectedCoupon.discountType === 'amount'
      ? Math.max(
          0,
          totalAfterDiscountWithoutCoupon - selectedCoupon.discountValue,
        )
      : totalAfterDiscountWithoutCoupon *
        (1 - selectedCoupon.discountValue / 100);
  return {
    totalBeforeDiscount,
    totalAfterDiscount,
    totalDiscount: totalBeforeDiscount - totalAfterDiscount,
  };
};

interface UpdateCartItemQuantity {
  cart: CartItem[];
  productId: string;
  newQuantity: number;
}

export const updateCartItemQuantity = ({
  cart,
  productId,
  newQuantity,
}: UpdateCartItemQuantity): CartItem[] => {
  const updatedCart = cart.map((cartItem) => {
    if (cartItem.product.id === productId) {
      return {
        ...cartItem,
        quantity:
          newQuantity > cartItem.product.stock
            ? cartItem.product.stock
            : newQuantity,
      };
    }
    return cartItem;
  });
  return updatedCart.filter((cartItem) => cartItem.quantity > 0);
};

export default {
  calculateItemTotal,
  calculateCartTotal,
  getMaxApplicableDiscount,
  updateCartItemQuantity,
};
