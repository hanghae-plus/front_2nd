export const createShoppingCart = () => {
  const items = {};

  const BULK_DISCOUNT_THRESHOLD = 30;
  const BULK_DISCOUNT_RATE = 0.25;
  const INDIVIDUAL_DISCOUNT_THRESHOLD = 10;

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

  const updateQuantity = (productId, quantity) => {
    if (quantity > 0) {
      items[productId].quantity = quantity;
    } else {
      removeItem(productId);
    }
  };

  const getItems = () => Object.values(items);

  const calculateDiscount = () => {
    const totalQuantity = getTotalQuantity();
    const totalBeforeDiscount = getItems().reduce((total, item) => total + item.product.price * item.quantity, 0);
    
    let maxDiscount = 0;
    getItems().forEach(item => {
      if (item.quantity >= INDIVIDUAL_DISCOUNT_THRESHOLD && item.product.discount) {
        const [threshold, rate] = item.product.discount[0];
        if (item.quantity >= threshold) {
          const itemDiscount = item.product.price * item.quantity * rate;
          maxDiscount = Math.max(maxDiscount, itemDiscount);
        }
      }
    });

    if (totalQuantity >= BULK_DISCOUNT_THRESHOLD) {
      const bulkDiscount = totalBeforeDiscount * BULK_DISCOUNT_RATE;
      maxDiscount = Math.max(maxDiscount, bulkDiscount);
    }

    return maxDiscount;
  };

  const getTotalQuantity = () => getItems().reduce((total, item) => total + item.quantity, 0);

  const getTotal = () => {
    const totalBeforeDiscount = getItems().reduce((total, item) => total + item.product.price * item.quantity, 0);
    const discount = calculateDiscount();
    const total = totalBeforeDiscount - discount;
    const discountRate = discount / totalBeforeDiscount;

    return {
      total: Math.round(total),
      discountRate
    };
  };

  return { addItem, removeItem, updateQuantity, getItems, getTotal };
};