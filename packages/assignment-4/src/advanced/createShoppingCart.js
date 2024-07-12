export const createShoppingCart = () => {
  /**item들 */
  const items = {};

  const getItems = () => Object.values(items);

  /**
   * Item 추가하는 함수
   * @param {추가한 상품} product
   * @param {수량} quantity
   */
  const addItem = (product, quantity = 1) => {
    items[product.id]
      ? (items[product.id].quantity += quantity)
      : (items[product.id] = { product, quantity });
  };

  /**
   * item을 제거하는  함수
   * @param {상품id} productId
   */
  const removeItem = (productId) => {
    delete items[productId];
  };

  /**
   * 수량을 업데이트 하는 함수
   * @param {상품id} productId
   * @param {상품 수량} quantity
   */
  const updateQuantity = (productId, quantity) => {
    quantity <= 0
      ? removeItem(productId)
      : (items[productId].quantity = quantity);
  };

  /**
   * 모든 아이템의 총 수량 구하는 함수
   * @returns 모든 아이템의 총 수량
   */
  const getTotalQuantity = () => {
    return getItems().reduce((acc, cur) => acc + cur.quantity, 0);
  };

  /**
   * 개별할인이 된 총합 구하는 함수
   * @param {상품} item
   * @returns 개별 할인으로 된 총 합계
   */
  const calculateItemTotal = (item) => {
    const total = item.product.price * item.quantity;

    const hasDiscount =
      item.product.discount && item.product.discount.length > 0;
    const [minQuantity, discountRate] = hasDiscount
      ? item.product.discount[0]
      : [0, 0];

    if (hasDiscount && item.quantity >= minQuantity) {
      return total * (1 - discountRate);
    }

    return total;
  };

  /**
   * 할인 전 가격 구하는 함수
   * @param {item들} items
   * @returns
   */
  const getTotalBeforeDiscount = (items) => {
    return items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  /**
   * 개별 할인 가격을 구하는 함수
   * @param {item들} items
   * @returns
   */
  const getDiscountedTotal = (items) => {
    return items.reduce((total, item) => total + calculateItemTotal(item), 0);
  };

  /**
   * 최종적으로 비교하여 합계를 구하는 함수
   * @returns 최종 합계 가격
   */
  const getTotal = () => {
    const items = getItems();
    const totalBeforeDiscount = getTotalBeforeDiscount(items);
    let total = getDiscountedTotal(items);

    let discountRate = (totalBeforeDiscount - total) / totalBeforeDiscount;

    const totalQuantity = getTotalQuantity();
    if (totalQuantity >= 30) {
      discountRate = 0.25;
      total = totalBeforeDiscount * (1 - discountRate);
    }

    return { total, discountRate };
  };

  return {
    addItem,
    removeItem,
    updateQuantity,
    getItems,
    getTotal,
    getTotalQuantity,
  };
};
