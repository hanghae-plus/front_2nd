/**
 * @typedef {Object} Product
 * @property {string} id - 상품의 고유 식별자
 * @property {string} name - 상품의 이름
 * @property {number} price - 상품의 가격 (원 단위)
 * @property {number} discount - 상품의 할인율 (0부터 1 사이의 값)
 */

/**
 * 사용 가능한 상품 목록
 * @type {Product[]}
 */
export const productList = [
  { id: 'p1', name: '상품1', price: 10000, discount: 0.1 },
  { id: 'p2', name: '상품2', price: 20000, discount: 0.15 },
  { id: 'p3', name: '상품3', price: 30000, discount: 0.2 },
];
