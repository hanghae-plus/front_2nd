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
      if (item.quantity >= 10 && item.product.discount) {
        const [threshold, rate] = item.product.discount[0];
        if (item.quantity >= threshold) {
          const itemDiscount = item.product.price * item.quantity * rate;
          maxDiscount = Math.max(maxDiscount, itemDiscount);
        }
      }
    });

    if (totalQuantity >= 30) {
      const bulkDiscount = totalBeforeDiscount * 0.25;
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