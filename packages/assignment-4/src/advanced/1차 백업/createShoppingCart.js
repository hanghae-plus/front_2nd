import { products, DISCOUNT_RATES } from './shopInfos.js';
import { cartChangeEvent } from './customEvent.js';

export const createShoppingCart = () => {
  // cart에 들어있는 items
  const items = {};

  const addItem = (productId) => {
    if (!items[productId]) {
      items[productId] = { quantity: 1 };
    } else {
      items[productId].quantity += 1;
    }
    dispatchEvent(cartChangeEvent);
  };

  const removeItem = (productId) => {
    delete items[productId];
    dispatchEvent(cartChangeEvent);
  };

  // +와 - 버튼에 대해서만 기능하도록 하며, 신규 추가에 대해서는 위의 addItem이 사용되도록 한다.
  // change는 dataset에 위치하며 '1', '-1'
  const updateQuantity = ({ productId, change }) => {
    items[productId].quantity += Number(change);
    if (items[productId].quantity <= 0) {
      delete items[productId];
    }
    dispatchEvent(cartChangeEvent);
  };

  const getItems = () => items;

  const getTotalQuantity = () => {
    const productIds = Object.keys(items);
    return productIds.reduce((sum, productId) => sum + items[productId].quantity, 0);
  };

  const getTotalPriceBeforeDiscount = () =>
    Object.keys(items).reduce((sum, productId) => {
      const { price } = products.find((product) => product.productId === productId);
      const { quantity } = items[productId];
      return sum + price * quantity;
    }, 0);

  const calculateTotalPrice = (totalQuantity, totalPriceBeforeDiscount) => {
    if (totalQuantity >= 30) {
      return totalPriceBeforeDiscount * (1 - DISCOUNT_RATES.isQuantityGreaterThanOrEqual30);
    }
    return Object.keys(items).reduce((sum, productId) => {
      const { price } = products.find((product) => product.productId === productId);
      const { quantity } = items[productId];
      const discountRate = quantity >= 10 ? DISCOUNT_RATES[productId] : 0;
      return sum + price * quantity * (1 - discountRate);
    }, 0);
  };

  const getTotal = () => {
    const totalQuantity = getTotalQuantity();
    const totalPriceBeforeDiscount = getTotalPriceBeforeDiscount();
    const totalPrice = calculateTotalPrice(totalQuantity, totalPriceBeforeDiscount);
    return {
      total: totalPrice,
      discountRate: 1 - totalPrice / totalPriceBeforeDiscount,
    };
  };

  return { addItem, removeItem, updateQuantity, getItems, getTotal };
};
