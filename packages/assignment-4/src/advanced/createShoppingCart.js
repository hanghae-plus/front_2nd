import { DISCOUNT_RATES, DISCOUNT_THRESHOLDS } from "./store/constants.js";
import { CartItem, CartTotal } from "./templates.js";

export const createShoppingCart = (products) => {
  let items = {};

  const addItem = (productId, quantity = 1) => {
    if (items[productId]) {
      items[productId].quantity += quantity;
    } else {
      const product = products.find((p) => p.id === productId);
      items[productId] = { ...product, quantity: 1 };
    }
    updateCart();
  };

  const removeItem = (productId) => {
    delete items[productId];
    updateCart();
  };

  const updateQuantity = (productId, change) => {
    if (items[productId]) {
      items[productId].quantity += change;
      if (items[productId].quantity <= 0) {
        removeItem(productId);
      } else {
        updateCart();
      }
    }
  };

  const getItems = () => Object.values(items);

  const calculateDiscount = (quantity, id) => {
    if (quantity >= DISCOUNT_THRESHOLDS[id]) {
      return DISCOUNT_RATES[id];
    }
    return 0;
  };

  const getTotalQuantity = () =>
    getItems().reduce((sum, item) => sum + item.quantity, 0);

  const getTotal = () => {
    let total = 0;
    let totalBeforeDiscount = 0;
    const totalQuantity = getTotalQuantity();

    getItems().forEach((item) => {
      const itemTotal = item.price * item.quantity;
      const discount = calculateDiscount(item.quantity, item.id);
      totalBeforeDiscount += itemTotal;
      total += itemTotal * (1 - discount);
    });

    let discountRate = 0;
    if (totalQuantity >= DISCOUNT_THRESHOLDS.BULK) {
      const bulkDiscount = totalBeforeDiscount * DISCOUNT_RATES.BULK;
      const individualDiscount = totalBeforeDiscount - total;
      if (bulkDiscount > individualDiscount) {
        total = totalBeforeDiscount * (1 - DISCOUNT_RATES.BULK);
        discountRate = DISCOUNT_RATES.BULK;
      } else {
        discountRate = individualDiscount / totalBeforeDiscount;
      }
    } else {
      discountRate = (totalBeforeDiscount - total) / totalBeforeDiscount;
    }

    return { total, discountRate };
  };

  const updateCart = () => {
    const cartItemsContainer = document.getElementById("cart-items");
    const totalContainer = document.getElementById("cart-total");

    cartItemsContainer.innerHTML = getItems()
      .map((item) => CartItem(item))
      .join("");
    const { total, discountRate } = getTotal();
    totalContainer.innerHTML = CartTotal({ total, discountRate });
  };

  return { addItem, removeItem, updateQuantity, getItems, getTotal };
};
