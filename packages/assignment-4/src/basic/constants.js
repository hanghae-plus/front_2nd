/** 상품목록*/
export const products = [
  { id: 'p1', name: '상품1', price: 10000 },
  { id: 'p2', name: '상품2', price: 20000 },
  { id: 'p3', name: '상품3', price: 30000 },
];

/** 할인율 */
export const discountRate = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
  bulk: 0.25,
};

/** 할인받을 수 있는 수량 */
export const MIN_DISCOUNT_QUANTITY = {
  bulk: 30,
  individual: 10,
};
