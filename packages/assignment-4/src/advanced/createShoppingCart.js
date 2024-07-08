import { products } from './products.js';
import { DISCOUNT_RATES } from './constants.js';

export const createShoppingCart = () => {
  // cart에 들어있는 items
  const items = {};

  const addItem = (productId) => {
    if (!items[productId]) {
      items[productId] = { quantity: 1 };
    } else {
      items[productId].quantity += 1;
    }
  };

  const removeItem = (productId) => {
    delete items[productId];
  };

  // +와 - 버튼에 대해서만 기능하도록 하며, 신규 추가에 대해서는 위의 addItem이 사용되도록 한다.
  const updateQuantity = ({ updateType, productId }) => {
    if (updateType === 'increase') {
      items[productId].quantity += 1;
      return;
    }
    if (updateType === 'decrease') {
      if (items[productId].quantity === 1) return removeItem(productId);
      items[productId].quantity -= 1;
      return;
    }
  };

  const getItems = () => {
    const result = [];
    const productIds = Object.keys(items);
    productIds.forEach((productId) => {
      result.push({ productId, quantity: items[productId].quantity });
    });
    return result;
  };

  const calculateDiscount = () => {
    return 0;
  };

  const getTotalQuantity = () => {
    const productIds = Object.keys(items);
    return productIds.reduce((sum, productId) => sum + items[productId].quantity, 0);
  };

  const getTotal = () => {
    const totalPriceBeforeDiscount = Object.keys(items).reduce((sum, productId) => {
      const { price } = products.find((product) => product.productId === productId);
      const { quantity } = items[productId];
      return sum + price * quantity;
    }, 0);
    return {
      total: 0,
      discountRate: 0,
    };
  };

  return { addItem, removeItem, updateQuantity, getItems, getTotal };
};
