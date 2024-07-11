import { calculateDiscount } from "./utils";

export const createShoppingCart = () => {
  let items = [];

  const addItem = (product, quantity = 1) => {
    const existingItem = items.find((item) => item.product.id === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      items.push({ product, quantity });
    }
  };

  const removeItem = (productId) => {
    items = items.filter((item) => item.product.id !== productId);
  };

  const updateQuantity = (productId, quantity) => {
    const item = items.find((item) => item.product.id === productId);
    if (item) {
      if (quantity <= 0) {
        removeItem(productId);
      } else {
        item.quantity = quantity;
      }
    }
  };

  const getItems = () => items;

  const getTotal = () => {
    let total = 0;
    let totalQuantity = 0;
    let discountTotal = 0;

    items.forEach((item) => {
      const productTotal = item.product.price * item.quantity;
      total += productTotal;
      totalQuantity += item.quantity;

      const discountRate = calculateDiscount({
        productId: item.product.id,
        quantity: item.quantity,
      });

      discountTotal += productTotal * discountRate;
    });

    if (totalQuantity >= 30) {
      const overallDiscount = total * 0.25;
      if (overallDiscount > discountTotal) {
        discountTotal = overallDiscount;
      }
    }

    const discountedTotal = total - discountTotal;
    const discountRate = discountTotal / total;

    return {
      total: discountedTotal,
      discountRate: discountRate,
    };
  };

  return {
    addItem,
    removeItem,
    updateQuantity,
    getItems,
    getTotal,
  };
};
