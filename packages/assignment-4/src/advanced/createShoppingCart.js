export const createShoppingCart = () => {
  const items = {};

  // 장바구니 데이터에 신규 아이템 추가
  const addItem = (item, count) => {
    const productId = item.id;

    if (items[productId]) {
      // 기존 아이템 수량 변경
      items[productId].quantity += count ? count : 1;
    } else {
      // 기존에 없던 새로운 아이템 추가
      items[productId] = {
        product: { ...item },
        quantity: count ? count : 1,
      };
    }

    // 수량이 0일 때 제품 삭제
    if (items[productId].quantity <= 0) {
      removeItem(productId);
    }
  };

  // 장바구니 데이터에서 제품 삭제
  const removeItem = (productId) => {
    delete items[productId];
  };

  // 원하는 수량으로 변경
  const updateQuantity = (productId, count) => {
    if (count === 0) return removeItem(productId);

    items[productId].quantity = count;
  };

  // 장바구니 데이터 배열로 변환
  const getItems = () => Object.values(items);

  // 할인율 계산
  const calculateDiscount = (originPrice, discountPrice) => {
    return (originPrice - discountPrice) / originPrice;
  };

  // 할인율 관련 상수
  const INDIVIDUAL_LIMIT = 10;
  const INDIVIDUAL_RATE = {
    p1: 0.1,
    p2: 0.15,
    p3: 0.2,
  };
  const BULK_LIMIT = 30;
  const BULK_RATE = 0.25;

  // 원가 및 할인가 계산
  const calculatePrice = () => {
    let originPrice = 0;
    let individualPrice = 0;
    let bulkPrice = 0;

    getItems().forEach(({ product, quantity }) => {
      originPrice += product.price * quantity;
      individualPrice +=
        quantity >= INDIVIDUAL_LIMIT
          ? product.price * quantity * (1 - INDIVIDUAL_RATE[product.id])
          : product.price * quantity;
    });
    bulkPrice = originPrice * (1 - BULK_RATE);

    return { originPrice, individualPrice, bulkPrice };
  };

  // 전체 수량 계산
  const getTotalQuantity = () =>
    getItems().reduce((acc, { quantity }) => acc + quantity, 0);

  // 총액 및 할인율 계산
  const getTotal = () => {
    const { originPrice, individualPrice, bulkPrice } = calculatePrice();
    const totalQuantity = getTotalQuantity();

    let total = bulkPrice;
    let discountRate = BULK_RATE;

    if (totalQuantity < BULK_LIMIT || bulkPrice >= individualPrice) {
      total = individualPrice;
      discountRate = calculateDiscount(originPrice, individualPrice);
    }

    return { total, discountRate };
  };

  return {
    addItem,
    removeItem,
    updateQuantity,
    getItems,
    getTotal,
  };
};
