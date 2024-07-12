const INDIVIDUAL_DISCOUNT_THRESHOLD = 10;

/**
 * 할인 서비스를 생성합니다.
 * @param {Object} discountRates - 상품별 할인율
 * @param {number} bulkDiscountRate - 대량 구매 할인율
 * @param {number} bulkDiscountThreshold - 대량 구매 할인 적용 기준 수량
 * @returns {Object} 할인 계산 함수를 포함한 객체
 */
export const createDiscountService = (discountRates, bulkDiscountRate, bulkDiscountThreshold) => {
  /**
   * 개별 상품의 할인율을 계산합니다.
   * @param {Object} item - 상품 정보
   * @returns {number} 할인율
   */
  const calculateIndividualDiscount = (item) =>
    item.quantity >= INDIVIDUAL_DISCOUNT_THRESHOLD ? discountRates[item.id] || 0 : 0;

  /**
   * 장바구니의 총 할인을 계산합니다.
   * @param {Array} items - 장바구니 상품 목록
   * @returns {Object} 최종 금액과 할인율
   */
  const calculateCart = (items) => {
    const { totalQuantity, totalBeforeDiscount, totalAfterIndividualDiscount } = items.reduce(
      (acc, item) => {
        const itemTotal = item.price * item.quantity;
        const individualDiscount = calculateIndividualDiscount(item);
        return {
          totalQuantity: acc.totalQuantity + item.quantity,
          totalBeforeDiscount: acc.totalBeforeDiscount + itemTotal,
          totalAfterIndividualDiscount: acc.totalAfterIndividualDiscount + itemTotal * (1 - individualDiscount),
        };
      },
      { totalQuantity: 0, totalBeforeDiscount: 0, totalAfterIndividualDiscount: 0 }
    );

    const bulkDiscountTotal = totalBeforeDiscount * (1 - bulkDiscountRate);
    const totalAfterDiscount =
      totalQuantity >= bulkDiscountThreshold
        ? Math.min(totalAfterIndividualDiscount, bulkDiscountTotal)
        : totalAfterIndividualDiscount;

    const totalDiscountRate = (totalBeforeDiscount - totalAfterDiscount) / totalBeforeDiscount;

    return {
      finalTotal: Math.round(totalAfterDiscount),
      discountRate: totalDiscountRate,
    };
  };

  return {
    calculateCart,
  };
};
