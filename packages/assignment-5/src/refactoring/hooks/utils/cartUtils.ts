import { CartItem, Coupon, Product } from '../../../types';

// ---- 개수 반환 ----
// 각 아이템의 가격 합계 반환
export const calculateItemTotal = (item: CartItem) => {
  return (
    item.product.price * item.quantity * (1 - getMaxApplicableDiscount(item))
  );
};

// 장바구니에 담을 수 있는 최대 개수 반환
export const calculateMaxQuantity = (newQuantity: number, stock: number) => {
  return Math.max(0, Math.min(newQuantity, stock));
};

// 특정 아이템의 더 담을 수 있는 개수 반환
export const getRemainingStockFromCart = (
  cart: CartItem[],
  product: Product
) => {
  const cartItem = findCartItemById(cart, product.id);
  return product.stock - (cartItem?.quantity || 0);
};

// ---- 금액 반환 ----
// 각 아이템에 적용 가능한 최대 할인 금액 반환
export const getMaxApplicableDiscount = ({ product, quantity }: CartItem) => {
  return product.discounts.reduce((appliedDiscount, discount) => {
    if (quantity < discount.quantity) {
      return appliedDiscount;
    }
    return Math.max(appliedDiscount, discount.rate);
  }, 0);
};

// 장바구니 내 할인 전후 금액과 할인액 반환
export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
) => {
  const [totalBeforeDiscount, discountByQuantity] = calculateDiscounts(cart);
  const discountByCoupon = calculateDiscountByCoupon(
    totalBeforeDiscount,
    discountByQuantity,
    selectedCoupon
  );
  const totalDiscount = discountByCoupon + discountByQuantity;
  const totalAfterDiscount = totalBeforeDiscount - totalDiscount;

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
    totalDiscount: Math.round(totalDiscount),
  };
};

// 장바구니 내 할인 전 금액과 할인액 반환(적당한 함수명이..)
export const calculateDiscounts = (cart: CartItem[]) => {
  return cart.reduce(
    ([prevBeforeDiscount, prevDiscountByQuantity], cartItem) => {
      const currentPrice = cartItem.product.price * cartItem.quantity;
      const currentDiscount = currentPrice * getMaxApplicableDiscount(cartItem);

      return [
        prevBeforeDiscount + currentPrice,
        prevDiscountByQuantity + currentDiscount,
      ];
    },
    [0, 0]
  );
};

// 쿠폰을 통해 할인받는 금액 반환
export const calculateDiscountByCoupon = (
  totalBeforeDiscount: number,
  discountByQuantity: number,
  selectedCoupon: Coupon | null
) => {
  return selectedCoupon?.discountType === 'amount'
    ? selectedCoupon.discountValue
    : ((totalBeforeDiscount - discountByQuantity) *
        (selectedCoupon?.discountValue || 0)) /
        100;
};

// ---- array 반환 ----
// 특정 아이템의 수량을 변경한 목록 반환(0개의 경우 삭제)
export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number
): CartItem[] => {
  return cart
    .map((item) => {
      if (item.product.id === productId) {
        const maxQuantity = calculateMaxQuantity(
          newQuantity,
          item.product.stock
        );
        return maxQuantity > 0 ? { ...item, quantity: maxQuantity } : null;
      }
      return item;
    })
    .filter((item): item is CartItem => item !== null);
};

// 장바구니 목록에 새로운 아이템을 추가해 반환
export const appendNewCartItem = (cart: CartItem[], product: Product) => {
  const existingItem = findCartItemById(cart, product.id);
  if (existingItem) {
    return updateCartItemQuantity(
      cart,
      existingItem.product.id,
      existingItem.quantity + 1
    );
  }
  return [...cart, { product, quantity: 1 }];
};

// 아이템 id와 일치하지 않는 목록 반환(아이템 삭제)
export const filterCartByProductId = (cart: CartItem[], productId: string) => {
  return cart.filter((cartItem) => cartItem.product.id !== productId);
};

// 장바구니에서 아이템을 찾아 반환
export const findCartItemById = (cart: CartItem[], productId: string) => {
  return cart.find((item) => item.product.id === productId);
};
