/**
 * 장바구니 계산 결과를 반환합니다.
 * @param {Object} cart - 장바구니 객체 (상품 ID를 키로, 가격과 수량을 값으로 갖는 객체)
 * @returns {[number, number]} - 총 금액과 할인 적용 후의 금액
 */
export const getCartCalculations = cart => {
  const itemPrices = [];
  const discountItemPrices = [];
  const itemDiscountList = [];

  let totalQuantity = 0;
  Object.values(cart).map(({ price, quantity, id }) => {
    itemPrices.push(price * quantity);
    itemDiscountList.push(quantity, id);
    discountItemPrices.push(price * quantity * calculateDiscount(quantity, id));
    totalQuantity += quantity;
  });

  const totalPrice = sum(itemPrices);
  if (totalQuantity >= 30) return [totalPrice, totalPrice * calculateDiscount(totalQuantity)];

  return [totalPrice, sum(discountItemPrices)];
};

/**
 * 주어진 수량과 상품 ID에 따라 할인율을 계산합니다.
 * @param {number} quantity - 상품 수량
 * @param {string} productId - 상품 ID
 * @returns {number} - 할인율 (0과 1 사이의 값)
 */
export function calculateDiscount(quantity, productId) {
  if (quantity >= 30) return 0.25;

  if (productId === 'p1' && quantity >= 10) return 0.1;
  if (productId === 'p2' && quantity >= 10) return 0.15;
  if (productId === 'p3' && quantity >= 10) return 0.2;

  return 0;
}

/**
 *
 * @param {number[]} list - 숫자 배열
 * @returns {number} - 배열 요소의 합계
 */
export function sum(list) {
  if (!Array.isArray(list) || !list.every(Number.isInteger)) {
    throw new Error('정수 배열을 입력해야 합니다.');
  }
  return list.reduce((acc, num) => acc + num, 0);
}
