/**
 * @fileoverview 장바구니 할인 계산 유틸리티
 * @author Your Name
 * @version 1.0.0
 */

/**
 * 개별 상품 할인이 적용되는 최소 수량
 * @constant {number}
 */
const DISCOUNT_QUANTITY = 10;

/**
 * 대량 구매 할인이 적용되는 최소 수량
 * @constant {number}
 */
const BULK_DISCOUNT_QUANTITY = 30;

/**
 * 대량 구매 할인율
 * @constant {number}
 */
const BULK_DISCOUNT_RATE = 0.25;

/**
 * 개별 상품의 할인율을 계산합니다.
 * @param {Object} product - 상품 객체
 * @param {number} quantity - 구매 수량
 * @returns {number} 할인율 (0 ~ 1 사이의 값)
 */
const calculateItemDiscount = (product, quantity) => {
  if (quantity >= DISCOUNT_QUANTITY) {
    return product.discount[0][1];
  }
  return 0;
};

/**
 * 장바구니 내 모든 상품의 총계를 계산합니다.
 * @param {Array<Object>} items - 장바구니 아이템 배열
 * @returns {Object} 총계 정보 객체
 * @property {number} total - 할인이 적용된 총 금액
 * @property {number} totalQuantity - 총 상품 수량
 * @property {number} subtotal - 할인 적용 전 총 금액
 */
export const calculateTotals = (items) => {
  return items.reduce(
    (acc, item) => {
      const itemTotal = item.product.price * item.quantity;
      const discount = calculateItemDiscount(item.product, item.quantity);
      const discountedTotal = itemTotal * (1 - discount);

      return {
        total: acc.total + discountedTotal,
        totalQuantity: acc.totalQuantity + item.quantity,
        subtotal: acc.subtotal + itemTotal,
      };
    },
    { total: 0, totalQuantity: 0, subtotal: 0 }
  );
};

/**
 * 최종 할인율과 총액을 계산합니다.
 * @param {number} total - 개별 할인이 적용된 총액
 * @param {number} totalQuantity - 총 상품 수량
 * @param {number} subtotal - 할인 적용 전 총액
 * @returns {Object} 최종 할인 정보 객체
 * @property {number} discountRatio - 최종 할인율 (0 ~ 1 사이의 값)
 * @property {number} finalTotal - 최종 할인이 적용된 총액
 */
export const calculateDiscountRatio = (total, totalQuantity, subtotal) => {
  let finalTotal = total;
  let discountRatio = (subtotal - total) / subtotal;

  if (totalQuantity >= BULK_DISCOUNT_QUANTITY) {
    const bulkDiscountTotal = subtotal * (1 - BULK_DISCOUNT_RATE);
    if (bulkDiscountTotal < finalTotal) {
      finalTotal = bulkDiscountTotal;
      discountRatio = BULK_DISCOUNT_RATE;
    }
  }

  return { discountRatio, finalTotal };
};
