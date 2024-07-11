const DISCOUNT_PERCENT = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
};

const MIN_DISCOUNT_QUANTITY = 10;
const MAX_DISCOUNT_QUANTITY = 30;
const MAX_DISCOUNT_RATE = 0.25;

// 네이밍 변경 및 product를 받도록 변경
export const findProduct = ({ product, selectedId }) => {
  return product.find(({ id }) => id === selectedId);
};

export const calculateItemTotal = ({ price, quantity, discount = 0 }) => {
  return price * quantity * (1 - discount);
};

export const calculateDiscount = ({ quantity, productId }) => {
  return quantity >= MIN_DISCOUNT_QUANTITY ? DISCOUNT_PERCENT[productId] : 0;
};

// 희재님 처럼 유틸함수 생성
export const getQuantityByCartItem = (cartItem) => {
  return parseInt(cartItem.querySelector("span").textContent.split("x ")[1]);
};

export const calculateDiscountRate = ({
  totalQuantity,
  prevTotal,
  totalAmount,
}) => {
  return totalQuantity >= MAX_DISCOUNT_QUANTITY
    ? MAX_DISCOUNT_RATE
    : (prevTotal - totalAmount) / prevTotal;
};
