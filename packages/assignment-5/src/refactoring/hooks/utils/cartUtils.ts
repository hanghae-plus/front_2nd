import { CartItem, Coupon, Discount, Product } from "../../../types";

export const calculateItemTotal = (item: CartItem) => {
  // 할인 없이 총액을 계산해야 합니다.
  // 수량에 따라 올바른 할인을 적용해야 합니다.

  const sortedDiscounts = item.product.discounts.sort(
    (a: Discount, b: Discount) => b.quantity - a.quantity
  );
  const nowDiscount =
    sortedDiscounts.find((discount) => discount.quantity <= item.quantity)
      ?.rate || 0;
  const totalCost = item.product.price * item.quantity * (1 - nowDiscount);

  return totalCost;
};

export const getMaxApplicableDiscount = (item: CartItem) => {
  // 할인이 적용되지 않으면 0을 반환해야 합니다.
  // 적용 가능한 가장 높은 할인율을 반환해야 합니다.

  if (item.product.discounts.length === 0) return 0;

  const sortedDiscounts = item.product.discounts.sort(
    (a: Discount, b: Discount) => b.rate - a.rate
  );
  const maxDiscount =
    sortedDiscounts.find((discount) => discount.quantity <= item.quantity)
      ?.rate || 0;

  return maxDiscount;
};

export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
) => {
  const totalBeforeDiscount = cart.reduce((ac, cu) => {
    return ac + cu.product.price * cu.quantity;
  }, 0);
  let totalAfterDiscount = cart.reduce((ac, cu) => {
    return ac + calculateItemTotal(cu);
  }, 0);

  if (selectedCoupon) {
    totalAfterDiscount =
      selectedCoupon?.discountType === "amount"
        ? totalAfterDiscount - selectedCoupon.discountValue
        : (totalAfterDiscount * (100 - selectedCoupon?.discountValue)) / 100;
  }

  const totalDiscount = totalBeforeDiscount - totalAfterDiscount;

  return {
    totalBeforeDiscount: totalBeforeDiscount,
    totalAfterDiscount: totalAfterDiscount,
    totalDiscount: totalDiscount,
  };
};

export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number
): CartItem[] => {
  // 수량을 올바르게 업데이트해야 합니다
  // 수량이 0으로 설정된 경우 항목을 제거해야 합니다.
  // 재고 한도를 초과해서는 안 됩니다.

  const nowProduct: CartItem = cart.find(
    (item: CartItem) => item.product.id === productId
  );

  if (newQuantity === 0)
    return cart.filter((item: CartItem) => item.product.id !== productId);
  else if (newQuantity > nowProduct.product.stock)
    return cart.map((item: CartItem) => {
      return item.product.id === productId
        ? { ...item, quantity: nowProduct.product.stock }
        : item;
    });
  else
    return cart.map((item: CartItem) => {
      return item.product.id === productId
        ? { ...item, quantity: newQuantity }
        : item;
    });
};
