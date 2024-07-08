import { DISCOUNT_RATES } from './constants.js';

export const calculateTotalQuantity = (cartItems) =>
  Object.keys(cartItems).reduce((sum, productId) => sum + cartItems[productId].quantity, 0);

export const calculateTotalPriceBeforeDiscount = (cartItems) =>
  Object.keys(cartItems).reduce((sum, productId) => {
    const { price, quantity } = cartItems[productId];
    return sum + price * quantity;
  }, 0);

export const calculateTotalPrice = ({ cartItems, totalQuantity, totalPriceBeforeDiscount }) => {
  if (totalQuantity >= 30) {
    return totalPriceBeforeDiscount * (1 - DISCOUNT_RATES.isQuantityGreaterThanOrEqual30);
  }

  return Object.values(cartItems).reduce((sum, { price, quantity, productId }) => {
    const discountRate = quantity >= 10 ? DISCOUNT_RATES[productId] : 0;
    return sum + price * quantity * (1 - discountRate);
  }, 0);
};
