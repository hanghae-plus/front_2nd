export function createDiscountService(discountRates, bulkDiscountRate, bulkDiscountThreshold) {
  function calculateIndividualDiscount(item) {
    return item.quantity >= 10 ? discountRates[item.id] || 0 : 0;
  }

  function calculateCart(items) {
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

    if (totalQuantity >= bulkDiscountThreshold) {
      const bulkDiscountTotal = totalBeforeDiscount * (1 - bulkDiscountRate);
      totalAfterDiscount = Math.min(totalAfterDiscount, bulkDiscountTotal);
    }

    const totalDiscount = (totalBeforeDiscount - totalAfterDiscount) / totalBeforeDiscount;

    return {
      finalTotal: Math.round(totalAfterDiscount),
      discountRate: totalDiscount,
    };
  }

  return {
    calculateCart,
  };
}
