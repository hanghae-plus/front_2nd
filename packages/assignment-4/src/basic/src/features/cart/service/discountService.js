import { BULK_DISCOUNT_RATE, BULK_DISCOUNT_THRESHOLD, DISCOUNT_RATES } from '../../../shared/constants/discount';

function calculateIndividualDiscount(item) {
  return item.quantity >= 10 ? DISCOUNT_RATES[item.id] || 0 : 0;
}

export function calculateCart(items) {
  let totalQuantity = 0;
  let totalBeforeDiscount = 0;
  let totalAfterDiscount = 0;

  items.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    totalQuantity += item.quantity;
    totalBeforeDiscount += itemTotal;

    const individualDiscount = calculateIndividualDiscount(item);
    totalAfterDiscount += itemTotal * (1 - individualDiscount);
  });

  if (totalQuantity >= BULK_DISCOUNT_THRESHOLD) {
    const bulkDiscountTotal = totalBeforeDiscount * (1 - BULK_DISCOUNT_RATE);
    totalAfterDiscount = Math.min(totalAfterDiscount, bulkDiscountTotal);
  }

  const totalDiscount = (totalBeforeDiscount - totalAfterDiscount) / totalBeforeDiscount;

  return {
    finalTotal: Math.round(totalAfterDiscount),
    discountRate: totalDiscount,
  };
}
