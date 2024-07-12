export function createHTMLElement(tag, { attributes = {}, textContent = '' } = {}) {
  const element = document.createElement(tag);
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
  element.textContent = textContent;
  return element;
}

export function generateItemOptions(items) {
  return items.map((item) => `<option value="${item.id}">${item.name} - ${item.price}원</option>`).join('');
}

export function calculateTotalPrice(cartItems, discountRates) {
  const { totalQuantity, originalPrice, finalPrice } = cartItems.reduce(
    (acc, item) => {
      const quantity = parseInt(item.quantity);
      const totalPrice = item.price * quantity;
      const discountRatio = quantity >= discountRates.QUANTITY_THRESHOLD ? discountRates[item.id] : 0;

      acc.totalQuantity += quantity;
      acc.originalPrice += totalPrice;
      acc.finalPrice += totalPrice * (1 - discountRatio);
      return acc;
    },
    { totalQuantity: 0, originalPrice: 0, finalPrice: 0 },
  );

  const bulkDiscount = totalQuantity >= discountRates.BULK_THRESHOLD ? originalPrice * discountRates.BULK_DISCOUNT : 0;
  return Math.min(finalPrice, originalPrice - bulkDiscount);
}
