import { cartChangeEvent } from './customEvent.js';

/**
 * 장바구니 관리 객체 생성
 * @returns {object} 장바구니 관리 메서드 (getItems, addItem, removeItem, updateQuantity, getTotal)
 */
export const createShoppingCart = () => {
  const items = {};

  /**
   * 현재 장바구니의 항목을 반환
   * @returns {Array} 장바구니 항목의 배열 Array of { proudct, quantity }
   */
  const getItems = () => Object.values(items);

  /**
   * 장바구니에 상품을 추가
   * @param {{ productId: string; productName: string; price: number; discount?: [[number, number]] }} product
   * @param {number?} addCount 추가할 상품의 갯수 - 없을 경우 1로 처리
   */
  const addItem = (product, addCount) => {
    const { productId, productName, price, discount } = product;
    if (!items[productId]) {
      items[productId] = { product: { productId, productName, price, discount }, quantity: addCount ?? 1 };
      return;
    }
    items[productId].quantity += addCount ?? 1;
    dispatchEvent(cartChangeEvent);
  };

  /**
   * 장바구니에서 항목을 제거
   * @param {string} productId
   */
  const removeItem = (productId) => {
    delete items[productId];
    dispatchEvent(cartChangeEvent);
  };

  /**
   * 장바구니 항목의 수량을 변경
   * @param {string} productId
   * @param {number} nextQuantity - +1, -1 또는 결과 수량
   */
  const updateQuantity = (productId, nextQuantity) => {
    // nextQuantity가 1이나 -1인 경우
    if (nextQuantity === 1 || nextQuantity === -1) {
      items[productId].quantity += nextQuantity;
    } else {
      items[productId].quantity = nextQuantity;
    }
    if (items[productId].quantity <= 0) {
      removeItem(productId);
    }
    dispatchEvent(cartChangeEvent);
  };

  /**
   * 장바구니의 총액과 적용 할인율을 반환
   * @returns {{ total: number; discountRate: number }}
   */
  const getTotal = () => {
    const totalQuantity = Object.values(items).reduce((sum, { quantity }) => sum + quantity, 0);
    const totalPriceBeforeDiscount = Object.values(items).reduce(
      (sum, { product: { price }, quantity }) => sum + price * quantity,
      0,
    );
    if (totalQuantity >= 30) {
      return {
        total: totalPriceBeforeDiscount * (1 - 0.25),
        discountRate: 0.25,
      };
    }

    const totalPrice = Object.values(items).reduce((sum, { product: { price, discount }, quantity }) => {
      // product가 할인율을 가지고 있지 않은 경우 할인 갯수, 할인율을 각각 0으로 처리
      const [applicationQuantity, discountRate] = discount?.[0] ?? [0, 0];
      if (quantity >= applicationQuantity) {
        return sum + price * quantity * (1 - discountRate);
      }
      return sum + price * quantity;
    }, 0);
    return {
      total: totalPrice,
      discountRate: 1 - totalPrice / totalPriceBeforeDiscount,
    };
  };

  return { getItems, addItem, removeItem, updateQuantity, getTotal };
};
