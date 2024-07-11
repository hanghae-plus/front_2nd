import { cartChangeEvent } from '/src/advanced/customEvent.js';

/**
 * 장바구니 관리 객체를 생성합니다.
 * @returns {object} 장바구니 관리 메서드 (getItems, addItem, removeItem, updateQuantity, getTotal)
 */
export const createShoppingCart = () => {
  const cartItemsObj = {};

  /**
   * 현재 장바구니의 항목을 반환합니다.
   * @returns {Array} 장바구니 항목의 배열 (product와 quantity를 포함한 객체들의 배열)
   */
  const getItems = () => Object.values(cartItemsObj);

  /**
   * 장바구니에 상품을 추가합니다.
   * @param {{ productId: string; productName: string; price: number; discount?: [[number, number]] }} productObj - 추가할 상품 객체
   * @param {number} [addCount=1] - 추가할 상품의 갯수 (기본값: 1)
   */
  const addItem = (productObj, addCount = 1) => {
    const { productId } = productObj;
    if (!cartItemsObj[productId]) {
      cartItemsObj[productId] = { product: productObj, quantity: addCount };
    } else {
      cartItemsObj[productId].quantity += addCount;
    }
    dispatchEvent(cartChangeEvent);
  };

  /**
   * 장바구니에서 항목을 제거합니다.
   * @param {string} productId - 제거할 상품의 ID
   */
  const removeItem = (productId) => {
    delete cartItemsObj[productId];
    dispatchEvent(cartChangeEvent);
  };

  /**
   * 장바구니 항목의 수량을 변경합니다.
   * @param {string} productId - 수량을 변경할 상품의 ID
   * @param {number} changeAmount - 변경할 수량 (+1, -1) 또는 새로운 수량
   */
  const updateQuantity = (productId, changeAmount) => {
    if (!cartItemsObj[productId]) return;

    if (changeAmount === 1 || changeAmount === -1) {
      cartItemsObj[productId].quantity += changeAmount;
    } else {
      cartItemsObj[productId].quantity = changeAmount;
    }

    if (cartItemsObj[productId].quantity <= 0) {
      removeItem(productId);
    } else {
      dispatchEvent(cartChangeEvent);
    }
  };

  /**
   * 장바구니의 총액과 적용된 할인율을 계산합니다.
   * @returns {{ total: number; discountRate: number }} 총액과 할인율
   */
  const getTotal = () => {
    const totalQuantity = getItems().reduce((sum, { quantity }) => sum + quantity, 0);
    const totalPriceBeforeDiscount = getItems().reduce(
      (sum, { product: { price }, quantity }) => sum + price * quantity,
      0,
    );

    if (totalQuantity >= 30) {
      return {
        total: totalPriceBeforeDiscount * 0.75,
        discountRate: 0.25,
      };
    }

    const totalPrice = getItems().reduce((sum, { product: { price, discount }, quantity }) => {
      const [applicationQuantity = 0, discountRate = 0] = discount?.[0] ?? [];
      const itemPrice = quantity >= applicationQuantity ? price * quantity * (1 - discountRate) : price * quantity;
      return sum + itemPrice;
    }, 0);

    return {
      total: totalPrice,
      discountRate: 1 - totalPrice / totalPriceBeforeDiscount,
    };
  };

  return { getItems, addItem, removeItem, updateQuantity, getTotal };
};
