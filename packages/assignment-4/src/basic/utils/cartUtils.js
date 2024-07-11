export const createElement = (tag, attributes = {}) => {
  const element = document.createElement(tag);
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'className') {
      element.className = value;
    } else if (key === 'textContent') {
      element.textContent = value;
    } else {
      element.setAttribute(key, value);
    }
  });
  return element;
};

export function calculateCartTotals(
  cartItems,
  PRODUCTS,
  BULK_DISCOUNT_THRESHOLD,
  TOTAL_BULK_DISCOUNT_THRESHOLD,
  TOTAL_BULK_DISCOUNT_RATE
) {
  const totals = cartItems.reduce(
    (acc, item) => {
      const [productInfo, quantityString] = item.querySelector('span').textContent.split('x ');
      const quantity = parseInt(quantityString);
      const [productName, priceString] = productInfo.split(' - ');
      const price = parseInt(priceString);
      const product = PRODUCTS.find((p) => p.name === productName);

      const itemTotal = price * quantity;
      acc.totalQuantity += quantity;
      acc.totalBeforeDiscount += itemTotal;

      return acc;
    },
    { totalQuantity: 0, totalBeforeDiscount: 0 }
  );

  let totalAfterDiscount = totals.totalBeforeDiscount;

  cartItems.forEach((item) => {
    const [productInfo, quantityString] = item.querySelector('span').textContent.split('x ');
    const quantity = parseInt(quantityString);
    const [productName] = productInfo.split(' - ');
    const product = PRODUCTS.find((p) => p.name === productName);

    if (quantity >= BULK_DISCOUNT_THRESHOLD) {
      const itemTotal = product.price * quantity;
      const discountedItemTotal = itemTotal * (1 - product.bulkDiscountRate);
      totalAfterDiscount -= itemTotal - discountedItemTotal;
    }
  });

  if (totals.totalQuantity >= TOTAL_BULK_DISCOUNT_THRESHOLD) {
    const bulkDiscount = totalAfterDiscount * TOTAL_BULK_DISCOUNT_RATE;
    const individualDiscount = totals.totalBeforeDiscount - totalAfterDiscount;
    if (bulkDiscount > individualDiscount) {
      totalAfterDiscount = totals.totalBeforeDiscount * (1 - TOTAL_BULK_DISCOUNT_RATE);
    }
  }

  return { ...totals, totalAfterDiscount };
}
