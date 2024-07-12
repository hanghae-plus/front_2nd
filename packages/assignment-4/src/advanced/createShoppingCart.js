/**
 * 장바구니 관련 상태 및 로직 반환 함수
 */
export const createShoppingCart = () => {
  /**
   * 장바구니에 담긴 상품 목록
   * 
   * @type {{product: { id: string, name: string, price: number, discount: number[][] }, quantity: number}[]}
   */
  const items = [];

  /**
   * 장바구니 상품키로 인덱스 조회 함수
   * 
   * @param {string} id 
   * @returns 
   */
  const findIndexById = id =>
    items.findIndex(({ product }) => product.id === id);

  /**
   * 장바구니 추가 함수
   * 
   * @param {{ id: string, name: string, price: number, discount: number[][] }} item 
   * @param {number} quantity 
   */
  const addItem = (item, quantity) => {
    const cartItemIdx = findIndexById(item.id);

    if (cartItemIdx === -1) {
      items.push({ product: item, quantity: quantity ?? 1 });
    } else {
      items[cartItemIdx].quantity += 1;
    }
  };

  /**
   * 장바구니에서 상품 삭제 함수
   * 
   * @param {string} id 
   */
  const removeItem = id => {
    const cartItemIdx = findIndexById(id);

    if (cartItemIdx === -1) return;

    items.splice(cartItemIdx, 1);
  };

  /**
   * 장바구니 내 항목 수량 업데이트 함수
   * 
   * @param {string} id 
   * @param {number} newQuantity
   */
  const updateQuantity = (id, newQuantity) => {
    const cartItemIdx = findIndexById(id);

    if (cartItemIdx === -1) return;

    if (newQuantity) {
      items[cartItemIdx].quantity = newQuantity;
    } else {
      items.splice(cartItemIdx, 1);
    }
  };

  /**
   * 장바구니 목록 반환 함수
   * 
   * @returns 장바구니 상품 목록
   */
  const getItems = () => items;

  /**
   * 할인 금액 계산 함수
   * 
   * @param {number} originalTotal 할인 전 총 금액
   * @param {number} totalQuantity 총 상품 개수
   * 
   * @returns {{discount: number, discountRate: number}} 할인 금액, 할인율
   */
  const calculateDiscount = (originalTotal, totalQuantity) => {
    /** 기본 할인 금액 (30개 이상 구입 시, 25% 할인) */
    const bulkDiscount = originalTotal * 0.25;

    /** 개별 할인 금액 합 */
    const individualDiscount = items.reduce((acc, {product, quantity}) => {
      if (product.discount && quantity >= product.discount[0][0]) {
        return acc += product.price * quantity * product.discount[0][1];
      }

      return acc;
    }, 0);

    let discount = 0;
    let discountRate = 0;

    if (totalQuantity >= 30 && bulkDiscount > individualDiscount) {
      discount = bulkDiscount;
      discountRate = 0.25;
    } else {
      discount = individualDiscount;
      discountRate = individualDiscount / originalTotal;
    }

    return { discount, discountRate }
  };

  /**
   * 총 금액 반환 함수
   * 
   * @returns {{total: number, discountRate: number}} 할인 후 총 금액, 할인율
   */
  const getTotal = () => {
    const originalTotal = items.reduce((acc, cur) => acc += (cur.product.price * cur.quantity), 0);
    const totalQuantity = items.reduce((acc, cur) => acc += cur.quantity, 0);

    const discountInfo = calculateDiscount(originalTotal, totalQuantity);

    return { total: originalTotal - discountInfo.discount, discountRate: discountInfo.discountRate };
  };

  return { addItem, removeItem, updateQuantity, getItems, getTotal };
};
