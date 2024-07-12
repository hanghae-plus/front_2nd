import { calculateDiscountRatio, calculateTotals } from './utils/cartUtils';

/**
 * @typedef {Object} CartItem
 * @property {Object} product - 상품 객체
 * @property {number} quantity - 상품 수량
 */

/**
 * @typedef {Object} CartTotal
 * @property {number} total - 최종 합계 금액
 * @property {number} discountRate - 적용된 할인율
 */

/**
 * 쇼핑 카트 객체를 생성합니다.
 * @function
 * @returns {Object} 쇼핑 카트 메서드를 포함한 객체
 */
export const createShoppingCart = () => {
  /** @type {Array<CartItem>} */
  const items = [];

  return {
    /**
     * 카트에 상품을 추가합니다.
     * @param {Object} product - 추가할 상품 객체
     * @param {number} [quantity=1] - 추가할 수량
     */
    addItem(product, quantity = 1) {
      const existingItem = items.find((item) => item.product.id === product.id);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        items.push({ product, quantity });
      }
    },

    /**
     * 카트에서 상품을 제거합니다.
     * @param {string} productId - 제거할 상품의 ID
     */
    removeItem(productId) {
      const index = items.findIndex((item) => item.product.id === productId);
      if (index !== -1) {
        items.splice(index, 1);
      }
    },

    /**
     * 카트 내 상품의 수량을 업데이트합니다.
     * @param {string} productId - 업데이트할 상품의 ID
     * @param {number} newQuantity - 새로운 수량
     */
    updateQuantity(productId, newQuantity) {
      const item = items.find((item) => item.product.id === productId);
      if (item) {
        if (newQuantity > 0) {
          item.quantity = newQuantity;
        } else {
          this.removeItem(productId);
        }
      }
    },

    /**
     * 카트 내 모든 상품을 반환합니다.
     * @returns {Array<CartItem>} 카트 아이템 배열
     */
    getItems() {
      return items;
    },

    /**
     * 카트의 총계를 계산합니다.
     * @returns {CartTotal} 총계 정보
     */
    getTotal() {
      const { total, totalQuantity, subtotal } = calculateTotals(items);
      const { discountRatio, finalTotal } = calculateDiscountRatio(
        total,
        totalQuantity,
        subtotal
      );
      return {
        total: Math.round(finalTotal),
        discountRate: discountRatio,
      };
    },
  };
};
