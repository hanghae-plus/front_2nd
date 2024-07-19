import { CartItem, Coupon } from '../../../types';

// 개별 상품의 총 금액 계산
export const calculateItemTotal = (item: CartItem) => {
  const itemTotal = item.product.price * item.quantity;
  const maxDiscount = getMaxApplicableDiscount(item);
  return itemTotal * (1 - maxDiscount);
};

// 최대 적용 가능한 할인율 계산
export const getMaxApplicableDiscount = (item: CartItem) => {
  const { discounts } = item.product;
  const { quantity } = item;
  return discounts.reduce((max, discount) => {
    if (quantity >= discount.quantity) {
      return Math.max(max, discount.rate);
    }
    return max;
  }, 0);
};

// 장바구니 총 금액 계산
export const calculateCartTotal = (cart: CartItem[], selectedCoupon: Coupon | null) => {
  let totalBeforeDiscount = 0;
  let totalAfterDiscount = 0;

  cart.forEach(item => {
    const itemTotal = calculateItemTotal(item);
    totalBeforeDiscount += item.product.price * item.quantity;
    totalAfterDiscount += itemTotal;
  });

  let totalDiscount = totalBeforeDiscount - totalAfterDiscount;

  // 쿠폰 적용
  if (selectedCoupon) {
    if (selectedCoupon.discountType === 'amount') {
      totalAfterDiscount = Math.max(0, totalAfterDiscount - selectedCoupon.discountValue);
    } else {
      totalAfterDiscount *= (1 - selectedCoupon.discountValue / 100);
    }
    totalDiscount = totalBeforeDiscount - totalAfterDiscount;
  }

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
    totalDiscount: Math.round(totalDiscount)
  };
};

// 장바구니 상품 수량 업데이트
export const updateCartItemQuantity = (cart: CartItem[], productId: string, newQuantity: number): CartItem[] => {
  return cart.map(item => {
    if (item.product.id === productId) {
      const updatedQuantity = Math.max(0, Math.min(newQuantity, item.product.stock));
      return updatedQuantity > 0 ? { ...item, quantity: updatedQuantity } : null;
    }
    return item;
  }).filter((item): item is CartItem => item !== null);
};
