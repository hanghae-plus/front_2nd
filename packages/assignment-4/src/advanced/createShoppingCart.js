const TOTAL_DISCOUNT_THRESHOLD = 30;
const TOTAL_DISCOUNT_RATE = 0.25;

export const createShoppingCart = () => {
  let items = [];

  const findItem = (productId) => {
    return items.find(({ product }) => product.id === productId);
  };

  const addItem = (product, quantity) => {
    const existingItem = findItem(product.id);

    if (existingItem) {
      existingItem.quantity += quantity || 1;

      return;
    }

    items.push({ product, quantity: quantity || 1 });
  };

  const removeItem = (productId) => {
    items = items.filter(({ product }) => product.id !== productId);
  };

  const updateQuantity = (productId, quantityChange) => {
    const item = findItem(productId);

    if (!item) return;

    item.quantity = quantityChange;

    if (item.quantity <= 0) removeItem(productId);
  };

  const getItems = () => {
    return items;
  };

  const getTotalQuantity = () => {
    return items.reduce((acc, { quantity }) => acc + quantity, 0);
  };

  const calculateTotalBeforeDiscount = () => {
    return items.reduce(
      (acc, { product, quantity }) => acc + product.price * quantity,
      0
    );
  };

  const calculateDiscount = () => {
    const totalQuantity = getTotalQuantity();

    if (totalQuantity >= TOTAL_DISCOUNT_THRESHOLD) {
      const totalPrice = items.reduce(
        (acc, { product, quantity }) => acc + product.price * quantity,
        0
      );

      return totalPrice * TOTAL_DISCOUNT_RATE;
    }

    const totalDiscount = items.reduce((acc, { product, quantity }) => {
      if (quantity >= product.discount?.[0]?.[0]) {
        return acc + product.price * quantity * product.discount[0][1];
      }

      return acc;
    }, 0);

    return totalDiscount;
  };

  const getTotal = () => ({
    total: calculateTotalBeforeDiscount() - calculateDiscount(),
    discountRate: calculateDiscount() / calculateTotalBeforeDiscount(),
  });

  return { findItem, addItem, removeItem, updateQuantity, getItems, getTotal };
};
