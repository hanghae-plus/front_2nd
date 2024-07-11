import {
  BULK_QUANTITY,
  DEFAULT_DISCOUNT_RATE,
  DISCOUNT_QUANTITY,
} from '../constants';

export function hasItemInCart(itemList, id) {
  return Boolean(itemList.find((item) => item.id === id));
}

export function isOneItem(itemList, id) {
  return itemList.find((item) => item.id === id).quantity === 1;
}

export function isBulk(itemList) {
  return itemList.reduce((pre, cur) => pre + cur.quantity, 0) >= BULK_QUANTITY;
}

export function isNeedDiscount(itemList) {
  return Boolean(itemList.find((item) => item.quantity >= DISCOUNT_QUANTITY));
}

export function calculateTotal(discountRate, cartTotal) {
  return Math.round(
    discountRate > DEFAULT_DISCOUNT_RATE
      ? cartTotal * (1 - discountRate)
      : cartTotal
  );
}

export function formatRate(rate) {
  return (rate * 100).toFixed(1);
}
