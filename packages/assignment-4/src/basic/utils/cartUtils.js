import { productList } from '../data/product';
import {
  changeDiscountElement,
  changeTotalElement,
  updateProductQuantity,
} from '../elements/cart/cartElement';

const DISCOUNT_QUANTITY = 10;
const BULK_DISCOUNT_QUANTITY = 30;
const BULK_DISCOUNT_RATE = 0.25;

/**
 * 개별 상품의 할인을 계산합니다.
 * @param {Object} item - 상품 객체
 * @param {number} quantity - 상품 수량
 * @returns {number} 할인율
 */
export const calculateItemDiscount = (item, quantity) => {
  if (quantity < DISCOUNT_QUANTITY) return 0;
  return item.discount || 0;
};

/**
 * 상품 항목에서 수량을 추출합니다.
 * @param {HTMLElement} item - 상품 항목 요소
 * @returns {number} 상품 수량
 */
const extractQuantity = (item) => {
  const quantityElement = item.querySelector('span');
  return quantityElement
    ? parseInt(quantityElement.textContent.split('x ')[1])
    : 0;
};

/**
 * 장바구니의 총액을 계산합니다.
 * @param {NodeListOf<Element>} items - 장바구니 항목들
 * @returns {Object} 총액, 총 수량, 소계
 */
export const calculateTotals = (items) => {
  return Array.from(items).reduce(
    (acc, item) => {
      const productId = item.id;
      const product = productList.find((product) => product.id === productId);
      const quantity = extractQuantity(item);

      const itemTotal = product.price * quantity;
      const discount = calculateItemDiscount(product, quantity);

      return {
        total: acc.total + itemTotal * (1 - discount),
        totalQuantity: acc.totalQuantity + quantity,
        subtotal: acc.subtotal + itemTotal,
      };
    },
    { total: 0, subtotal: 0, totalQuantity: 0 }
  );
};

/**
 * 최종 할인율과 최종 총액을 계산합니다.
 * @param {number} total - 할인 적용 전 총액
 * @param {number} totalQuantity - 총 상품 수량
 * @param {number} subtotal - 소계
 * @returns {Object} 할인율과 최종 총액
 */
export const calculateDiscountRatio = (total, totalQuantity, subtotal) => {
  if (totalQuantity < BULK_DISCOUNT_QUANTITY) {
    const discountRatio = (subtotal - total) / subtotal;
    return { discountRatio, finalTotal: total };
  }

  const bulkDiscount = total * BULK_DISCOUNT_RATE;
  const individualDiscount = subtotal - total;

  if (bulkDiscount > individualDiscount) {
    const finalTotal = subtotal * (1 - BULK_DISCOUNT_RATE);
    return { discountRatio: BULK_DISCOUNT_RATE, finalTotal };
  }

  const discountRatio = (subtotal - total) / subtotal;
  return { discountRatio, finalTotal: total };
};

/**
 * 장바구니를 업데이트합니다.
 * @param {HTMLElement} cartTotalDivElement - 장바구니 총액 요소
 * @param {HTMLElement} cardItemsDivElement - 장바구니 항목 컨테이너
 */
export const updateCart = (cartTotalDivElement, cardItemsDivElement) => {
  const items = cardItemsDivElement.children;
  const { total, totalQuantity, subtotal } = calculateTotals(items);
  const { discountRatio, finalTotal } = calculateDiscountRatio(
    total,
    totalQuantity,
    subtotal
  );

  changeTotalElement(cartTotalDivElement, finalTotal);

  if (discountRatio > 0) {
    changeDiscountElement(cartTotalDivElement, discountRatio);
  }
};

/**
 * 개별 상품을 업데이트합니다.
 * @param {HTMLElement} target - 클릭된 요소
 */
export const updateProduct = (target) => {
  const productId = target.dataset.productId;
  const item = document.getElementById(productId);
  updateProductQuantity(item, target);
};
