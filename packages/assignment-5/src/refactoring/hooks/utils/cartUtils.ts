import { CartItem, Coupon } from "../../../types";


// 제품의 총액을 계산하는 함수
export const calculateItemTotal = (item: CartItem) => {
  const { product, quantity } = item;
  const maxDiscount = getMaxApplicableDiscount(item);
  const discountRate = 1 - maxDiscount;
  return product.price * quantity * discountRate;
};

// 적용 가능한 최대 할인율을 찾는 함수
export const getMaxApplicableDiscount = (item: CartItem) => {
  const { product, quantity } = item;
  const applicableDiscount = product.discounts
    .filter(discount => quantity >= discount.quantity)
    .reduce((max, discount) => Math.max(max, discount.rate), 0);
  return applicableDiscount;
};

// 장바구니 총액을 계산하는 함수
export const calculateCartTotal = (cart: CartItem[], selectedCoupon: Coupon | null) => {
  let totalBeforeDiscount = 0;
  let totalAfterDiscount = 0;

  cart.forEach(item => {
    const itemTotal = item.product.price * item.quantity;
    totalBeforeDiscount += itemTotal;

    const itemDiscount = getMaxApplicableDiscount(item);
    totalAfterDiscount += itemTotal * (1 - itemDiscount);
  });

  let totalDiscount = totalBeforeDiscount - totalAfterDiscount;

  // 쿠폰 적용
  if (selectedCoupon) {
    if (selectedCoupon.discountType === 'amount') {
      totalAfterDiscount = Math.max(0, totalAfterDiscount - selectedCoupon.discountValue);
    } else if (selectedCoupon.discountType === 'percentage') {
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

// 장바구니 아이템 수량을 업데이트하는 함수
export const updateCartItemQuantity = (cart: CartItem[], productId: string, newQuantity: number): CartItem[] => {
  return cart.map(item => {
    if (item.product.id === productId) {
      const updatedQuantity = Math.max(0, Math.min(newQuantity, item.product.stock));
      return { ...item, quantity: updatedQuantity };
    }
    return item;
  }).filter(item => item.quantity > 0);
};