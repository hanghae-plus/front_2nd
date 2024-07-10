const DISCOUNT_PERCENT = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
};

const MIN_DISCOUNT_QUANTITY = 10;
const MAX_DISCOUNT_QUANTITY = 30;
const MAX_DISCOUNT_RATE = 0.25;

export const findProduct = ({ product, selectedId }) => {
  return product.find(({ id }) => id === selectedId);
};

export const calculateDiscountedTotal = ({ price, quantity, discount = 0 }) => {
  return price * quantity * (1 - discount);
};

export const calculateDiscount = ({ quantity, productId }) => {
  return quantity >= MIN_DISCOUNT_QUANTITY ? DISCOUNT_PERCENT[productId] : 0;
};

export const getQuantityByCartItem = (cartItem) => {
  return parseInt(cartItem.querySelector("span").textContent.split("x ")[1]);
};

export const calculateDiscountRate = ({
  totalQuantity,
  prevTotal,
  originalTotal,
}) => {
  return totalQuantity >= MAX_DISCOUNT_QUANTITY
    ? MAX_DISCOUNT_RATE
    : (prevTotal - originalTotal) / prevTotal;
};
