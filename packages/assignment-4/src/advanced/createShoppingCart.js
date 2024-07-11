export const createShoppingCart = () => {
  const items = {};

  const addItem = (product, quantity = 1) => {
    const { id, name, price } = product;
    if (items[id]) {
      items[id].quantity += quantity;
    } else {
      items[id] = { product: { id, name, price }, quantity };
    }
  };

  const removeItem = (productId) => {
    delete items[productId];
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(productId);
    } else {
      items[productId].quantity = newQuantity;
    }
  };

  const getItems = () => {
    return Object.values(items);
  };

  const calculateDiscount = () => {
    let totalBeforeDiscount = 0;
    let total = 0;

    for (const itemId in items) {
      const { product, quantity } = items[itemId];
      const itemTotal = product.price * quantity;
      totalBeforeDiscount += itemTotal;
    }

    return totalBeforeDiscount > 0 ? 1 - total / totalBeforeDiscount : 0;
  };

  const getTotalQuantity = () => {
    return Object.values(items).reduce(
      (total, item) => total + item.quantity,
      0
    );
  };

  const getTotal = () => {
    let total = 0;

    for (const itemId in items) {
      const { product, quantity } = items[itemId];
      total += product.price * quantity;
    }

    const discountRate = calculateDiscount();
    return { total, discountRate };
  };

  return {
    addItem,
    removeItem,
    updateQuantity,
    getItems,
    getTotalQuantity,
    getTotal,
  };
};
