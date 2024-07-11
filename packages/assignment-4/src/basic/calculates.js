import { DISCOUNT_RATES } from '/src/basic/shopInfos.js';

export function calculateTotalQuantity(cartItemsObj) {
  return Object.values(cartItemsObj).reduce((sum, { quantity }) => sum + quantity, 0);
}

export function calculateTotalPriceBeforeDiscount(cartItemsObj) {
  return Object.values(cartItemsObj).reduce((sum, { price, quantity }) => sum + price * quantity, 0);
}

export function calculateTotalPrice({ cartItemsObj, totalQuantity, totalPriceBeforeDiscount }) {
  if (totalQuantity >= 30) {
    return totalPriceBeforeDiscount * (1 - DISCOUNT_RATES.isQuantityGreaterThanOrEqual30);
  }

  return Object.values(cartItemsObj).reduce((sum, { price, quantity, productId }) => {
    const discountRate = quantity >= 10 ? DISCOUNT_RATES[productId] : 0;
    return sum + price * quantity * (1 - discountRate);
  }, 0);
}

export function calculateAppliedDiscountRate(totalPrice, totalPriceBeforeDiscount) {
  return 1 - totalPrice / totalPriceBeforeDiscount;
}
