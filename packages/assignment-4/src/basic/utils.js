const DISCOUNT_RATE = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
};

const MIN_DISCOUNT_QUANTITY = 10;
const MAX_DISCOUNT_QUANTITY = 30;
export const MAX_DISCOUNT_RATE = 0.25;

export const findProduct = ({ products, selectedId }) => {
  return products.find(({ id }) => id === selectedId);
};

export const getCartItemText = ({ cartItem, index }) => {
  return cartItem.querySelector("span").textContent.split("x ")[index];
};

export const getDiscountRateById = ({ productId, quantity }) => {
  if (quantity < MIN_DISCOUNT_QUANTITY) {
    return 0;
  }

  return DISCOUNT_RATE[productId];
};

export const calculateDiscountRate = ({ quantity, prevTotal, totalPrice }) => {
  const bulkDiscount = totalPrice * MAX_DISCOUNT_RATE;
  const individualDiscount = prevTotal - totalPrice;

  return quantity >= MAX_DISCOUNT_QUANTITY && bulkDiscount > individualDiscount
    ? MAX_DISCOUNT_RATE
    : (prevTotal - totalPrice) / prevTotal;
};
