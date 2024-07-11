/**
 * @typedef {Object} DiscountRule
 * @property {number} quantity - 할인이 적용되는 최소 수량
 * @property {number} rate - 할인율 (0 ~ 1 사이의 값)
 */

/**
 * @typedef {Object} Product
 * @property {string} id - 상품의 고유 식별자
 * @property {string} name - 상품의 이름
 * @property {number} price - 상품의 가격 (원 단위)
 * @property {Array<DiscountRule>} discount - 할인 규칙 배열
 */

/**
 * 상품 목록
 * @type {Array<Product>}
 */
export const productList = [
  {
    id: 'p1',
    name: '상품1',
    price: 10000,
    discount: [[10, 0.1]], // 10개 이상 구매 시 10% 할인
  },
  {
    id: 'p2',
    name: '상품2',
    price: 20000,
    discount: [[10, 0.15]], // 10개 이상 구매 시 15% 할인
  },
  {
    id: 'p3',
    name: '상품3',
    price: 30000,
    discount: [[10, 0.2]], // 10개 이상 구매 시 20% 할인
  },
];
