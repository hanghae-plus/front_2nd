export const PRODUCTS = [
  { id: "p1", name: "상품1", price: 10000 },
  { id: "p2", name: "상품2", price: 20000 },
  { id: "p3", name: "상품3", price: 30000 },
];

const DISCOUNT_PERCENT = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
};

const MIN_DISCOUNT_QUANTITY = 10;
const MAX_DISCOUNT_QUANTITY = 30;
const MAX_DISCOUNT_RATE = 0.25;

export const createShoppingCart = () => {
  const items = {};

  const addItem = ({ product, quantity = 1 }) => {
    if (items[product.id]) {
      items[product.id].quantity += quantity;
    } else {
      items[product.id] = { product, quantity };
    }
  };

  const removeItemById = (id) => {
    delete items[id];
  };

  const updateQuantity = ({ id, quantity }) => {
    if (quantity === 0) {
      removeItemById(id);
    } else if (items[id]) {
      items[id].quantity = quantity;
    }

    return items[id];
  };

  const getItems = () => {
    return Object.values(items);
  };

  const getItemById = (id) => {
    return items[id];
  };

  const calculateDiscount = ({ productId, quantity }) => {
    return quantity >= MIN_DISCOUNT_QUANTITY ? DISCOUNT_PERCENT[productId] : 0;
  };

  const getTotalQuantity = () => {
    return Object.values(items).reduce(
      (total, { quantity }) => total + quantity,
      0,
    );
  };

  const getTotal = () => {
    let originalTotal = 0;
    let prevTotal = 0;
    const totalQuantity = getTotalQuantity();

    Object.values(items).map(({ product, quantity }) => {
      const discount = calculateDiscount({
        productId: product.id,
        quantity: quantity,
      });

      prevTotal += product.price * quantity;
      originalTotal += product.price * quantity * (1 - discount);
    });

    const discountRate =
      totalQuantity >= MAX_DISCOUNT_QUANTITY
        ? MAX_DISCOUNT_RATE
        : (prevTotal - originalTotal) / prevTotal;

    if (discountRate > 0) {
      originalTotal = prevTotal * (1 - discountRate);
    }
    return {
      total: Math.round(originalTotal),
      discountRate,
    };
  };

  return {
    addItem,
    removeItemById,
    updateQuantity,
    getItems,
    getTotal,
    getItemById,
  };
};
