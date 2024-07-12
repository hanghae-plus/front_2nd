export const createShoppingCart = () => {
  const items = {};

  const addItem = (product, quantity = 1) => {
    if (items[product.id]) {
      items[product.id].quantity += quantity;
    } else {
      items[product.id] = { product, quantity };
    }
  };

  const removeItem = (productId) => {
    delete items[productId];
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity > 0) {
      items[productId].quantity = newQuantity;
    } else {
      removeItem(productId);
    }
  };

  const getItems = () => Object.values(items);

  // 상품별 할인율 계산
  const calculateDiscount = (item) => {
    const { product, quantity } = item;
    if (quantity >= 10) {
      switch (product.id) {
        case 'p1':
          return 0.1;
        case 'p2':
          return 0.15;
        case 'p3':
          return 0.2;
        default:
          return 0;
      }
    }
    return 0;
  };

  const getTotalQuantity = () => {
    return Object.values(items).reduce((sum, item) => sum + item.quantity, 0);
  };

  const getTotal = () => {
    let total = 0;
    let totalBeforeDiscount = 0;

    getItems().forEach((item) => {
      const itemTotal = item.product.price * item.quantity;
      const discount = calculateDiscount(item);
      total += itemTotal * (1 - discount);
      totalBeforeDiscount += itemTotal;
    });

    const totalQuantity = getTotalQuantity();
    if (totalQuantity >= 30) {
      const bulkDiscountTotal = totalBeforeDiscount * 0.75;
      if (bulkDiscountTotal < total) {
        total = bulkDiscountTotal;
      }
    }

    const discountRate =
      (totalBeforeDiscount - total) / totalBeforeDiscount || 0;

    return { total, discountRate };
  };

  return { addItem, removeItem, updateQuantity, getItems, getTotal };
};
