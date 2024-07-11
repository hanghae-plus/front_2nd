const QUANTITY_SEPARATOR = 'x ';

/**
 * 장바구니 아이템 요소에서 수량을 추출합니다.
 * @param {HTMLElement} item - 장바구니 아이템 요소
 * @returns {number} 추출된 수량
 */
const extractQuantity = (item) => {
  const quantityText = item.querySelector('span').textContent.split(QUANTITY_SEPARATOR)[1];
  return parseInt(quantityText, 10);
};

/**
 * 장바구니 아이템 요소에서 상품 데이터를 추출합니다.
 * @param {HTMLElement} item - 장바구니 아이템 요소
 * @param {Function} findProduct - 상품을 찾는 함수
 * @returns {Object|null} 추출된 상품 데이터 또는 null
 */
const extractItemData = (item, findProduct) => {
  const product = findProduct(item.id);
  if (!product) {
    console.warn(`상품을 찾을 수 없습니다: ${item.id}`);
    return null;
  }

  return {
    id: product.id,
    price: product.price,
    quantity: extractQuantity(item),
  };
};

/**
 * 장바구니 아이템 요소들에서 상품 데이터를 추출합니다.
 * @param {NodeList} cartItemElements - 장바구니 아이템 요소들
 * @param {Function} findProduct - 상품을 찾는 함수
 * @returns {Array} 추출된 상품 데이터 배열
 */
export function extractCartItemsData(cartItemElements, findProduct) {
  return Array.from(cartItemElements)
    .map((item) => extractItemData(item, findProduct))
    .filter(Boolean);
}
