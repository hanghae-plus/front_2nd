import type { CartItem, Discount } from '../../../types';

// 할인 기준 중 가장 높은 할인율을 반환합니다.
export const getMaxDiscount = (discounts: Discount[]) => {
  return discounts.reduce((max, discount) => Math.max(max, discount.rate), 0);
};

// 할인 적용 가능한 최대 할인율을 반환하되, 할인이 적용되지 않는 경우 0을 반환합니다.
export const getMaxApplicableDiscount = ({
  product: { discounts },
  quantity,
}: CartItem) => {
  return discounts.reduce((maxDiscountRate, discount) => {
    if (quantity >= discount.quantity) {
      return Math.max(maxDiscountRate, discount.rate);
    }
    return maxDiscountRate;
  }, 0);
};

export const getAppliedDiscount = (cartItem: CartItem) => {
  const { discounts } = cartItem.product;
  const { quantity } = cartItem;
  return discounts.reduce((appliedDiscount, discount) => {
    if (quantity >= discount.quantity) {
      return Math.max(appliedDiscount, discount.rate);
    }
    return appliedDiscount;
  }, 0);
};
