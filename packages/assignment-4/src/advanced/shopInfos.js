export const products = [
  {
    productId: 'p1',
    productName: '상품1',
    price: 10000,
  },
  {
    productId: 'p2',
    productName: '상품2',
    price: 20000,
  },
  {
    productId: 'p3',
    productName: '상품3',
    price: 30000,
  },
];

export const DISCOUNT_RATES = {
  // 상품별 10개 이상일 시 할인율
  // productId: discountRate
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
  isQuantityGreaterThanOrEqual30: 0.25,
};
