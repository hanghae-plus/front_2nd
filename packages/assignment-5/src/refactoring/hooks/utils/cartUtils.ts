import { CartItem, Coupon } from "../../../types";

export const calculateItemTotal = (item: CartItem) => {
  const { price, discounts } = item.product;
  const { quantity } = item;

  let appliedDiscount = 0;

  if (discounts) {
    // 수량에 따라 적용할 최대 할인율 찾기
    for (const discount of discounts) {
      if (quantity >= discount.quantity) {
        appliedDiscount = Math.max(appliedDiscount, discount.rate);
      }
    }
  }
  // 할인 적용 후 총 가격 반환
  const discountedPrice = price * (1 - appliedDiscount);
  return discountedPrice * quantity;

  // return price * quantity;
};

export const getMaxApplicableDiscount = (item: CartItem) => {
  const { quantity } = item;
  const discount = item.product.discounts.reduce((maxDiscount, d) => {
    return quantity >= d.quantity && d.rate > maxDiscount ? d.rate : maxDiscount;
  }, 0);

  return discount;
};

export const calculateCartTotal = (cart: CartItem[], selectedCoupon: Coupon | null) => {
  let totalBeforeDiscount = 0;
  let totalAfterDiscount = 0;

  cart.forEach((item) => {
    const { price } = item.product;
    const { quantity } = item;
    totalBeforeDiscount += price * quantity; // 할인 적용 전 총 가격 누적

    const totalDiscountedByQuantity = calculateItemTotal(item); // 상품별 총 가격 - 수량별 할인 적용
    totalAfterDiscount += totalDiscountedByQuantity;
  });

  let totalDiscount = totalBeforeDiscount - totalAfterDiscount;

  // 쿠폰 적용
  if (selectedCoupon) {
    if (selectedCoupon.discountType === "amount") {
      totalAfterDiscount = Math.max(0, totalAfterDiscount - selectedCoupon.discountValue);
    } else {
      totalAfterDiscount *= 1 - selectedCoupon.discountValue / 100;
    }
    totalDiscount = totalBeforeDiscount - totalAfterDiscount;
  }

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
    totalDiscount: Math.round(totalDiscount),
  };
};

export const updateCartItemQuantity = (cart: CartItem[], productId: string, newQuantity: number): CartItem[] => {
  return cart
    .map((item) => {
      if (item.product.id === productId) {
        const maxQuantity = item.product.stock;
        // 새로운 수량 (newQuantity)을 0과 최대 수량 사이로 조정
        const updatedQuantity = Math.max(0, Math.min(newQuantity, maxQuantity));
        // 업데이트된 수량이 0보다 크면, 해당 아이템의 수량을 업데이트
        // 업데이트된 수량이 0이면, null을 반환
        return updatedQuantity > 0 ? { ...item, quantity: updatedQuantity } : null;
      }
      return item;
    })
    .filter((item): item is CartItem => item !== null); // null인 아이템을 제거
};
