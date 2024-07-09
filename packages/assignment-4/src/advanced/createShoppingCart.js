import {CartItem} from "./templates.js";

export const createShoppingCart = () => {
  const items = {};


  const getItems = () => items;

  const getItem = (key) => items[key];

  const addItem = (select) => {
    items[select.id] = CartItem(select, getQuantity, updateQuantity, removeItem)
  };

  const removeItem = (key) =>  {
    items[key].remove()
    delete items[key]
  };

  const updateQuantity = (key, num) => {
    const currentQuantity = parseInt(items[key].dataset.quantity);
    const sign = Math.sign(num);

    if (sign === 1) { // 양수
      items[key].dataset.quantity = currentQuantity + num;
    } else if (sign === -1) { // 음수
      if (currentQuantity > 1) {
        items[key].dataset.quantity =  currentQuantity + num;
      } else {
        removeItem(key);
      }
    }
  };

  const getQuantity = (key) => {
    if(!items[key]) return
    return  parseInt(items[key].dataset.quantity)
  }

  const calculateDiscount = () => {
    return 0;
  };


  const getTotalQuantity = () => 0;

  const getTotal = () => ({
    total: 0,
    discountRate: 0
  });

  return { addItem, removeItem, updateQuantity, getItems, getTotal, getItem, getQuantity };
};
