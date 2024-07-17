import { CartItem, Coupon } from "../../../types";

export const calculateItemTotal = (item: CartItem) => {
  const { product, quantity } = item;
  //할인 없이 총액 계산
  const totalPrice = product.price * quantity;

  //수량에 따라 올바른 할인 적용
  const discountedTotalPrice =
    totalPrice * (1 - getMaxApplicableDiscount(item));

  return discountedTotalPrice;
};

export const getMaxApplicableDiscount = (item: CartItem) => {
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

export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
) => {
  let beforeDiscountPrice = 0;
  beforeDiscountPrice = cart.reduce((sumCartPrice, currentItem) => {
    sumCartPrice += currentItem.product.price * currentItem.quantity; // 창기님이 reduce에서 return으로 바로 계산식을 반환하기 보다는 이렇게 빼서 다 더해진 sum 값만 리턴하면 깔끔하다고 알려주셨음
    return sumCartPrice;
  }, 0);

  let itemDiscountPrice = 0;
  itemDiscountPrice = cart.reduce((sumCartDiscount, currentItem) => {
    const discount = getMaxApplicableDiscount(currentItem);
    sumCartDiscount +=
      currentItem.product.price * currentItem.quantity * discount;
    return sumCartDiscount;
  }, 0);

  let afterDiscountPrice = beforeDiscountPrice - itemDiscountPrice;

  let couponDiscountPrice = 0;
  if (selectedCoupon) {
    couponDiscountPrice =
      selectedCoupon.discountType === "amount"
        ? selectedCoupon.discountValue
        : (afterDiscountPrice * selectedCoupon.discountValue) / 100;
    afterDiscountPrice -= couponDiscountPrice;
  }

  const totalDiscountPrice = beforeDiscountPrice - afterDiscountPrice;

  return {
    totalBeforeDiscount: beforeDiscountPrice,
    totalAfterDiscount: afterDiscountPrice,
    totalDiscount: totalDiscountPrice,
  };
};

export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number
): CartItem[] => {
  return cart.reduce((updatedCart, currentItem) => {
    if (currentItem.product.id === productId) {
      return newQuantity <= 0
        ? updatedCart // 추가 x
        : [
            ...updatedCart,
            {
              ...currentItem,
              // 상품 실제 재고 수량만큼만 담을 수 있도록 Math.min 처리
              quantity: Math.min(newQuantity, currentItem.product.stock),
            },
          ];
    }
    return [...updatedCart, currentItem];
  }, [] as CartItem[]);
};
