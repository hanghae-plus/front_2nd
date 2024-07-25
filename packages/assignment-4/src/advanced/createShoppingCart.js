export const PRODUCTS = [
  { id: "p1", name: "상품1", price: 10000 },
  { id: "p2", name: "상품2", price: 20000 },
  { id: "p3", name: "상품3", price: 30000 },
];

const DISCOUNT_RATE = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
};

const MIN_DISCOUNT_QUANTITY = 10;
const MAX_DISCOUNT_QUANTITY = 30;
const MAX_DISCOUNT_RATE = 0.25;

export const createShoppingCart = () => {
  const items = {};

  const addItem = (product, quantity = 1) => {
    if (items[product.id]) {
      items[product.id].quantity += quantity;
    } else {
      items[product.id] = { product, quantity };
    }
  };

  const removeItem = (id) => {
    delete items[id];
  };

  const updateQuantity = (id, quantity) => {
    if (quantity === 0) {
      removeItem(id);
    } else {
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

  const calculateDiscount = () => {
    const totalQuantity = getTotalQuantity();
    let totalWithDiscount = 0;
    let totalWithoutDiscount = 0;
    let discountRate = 0;

    const items = getItems();
    items.forEach((item) => {
      const { product, quantity } = item;
      const total = product.price * quantity;
      const discount =
        quantity < MIN_DISCOUNT_QUANTITY ? 0 : DISCOUNT_RATE[item.product.id];

      totalWithoutDiscount += total;
      totalWithDiscount += total * (1 - discount);
    });

    discountRate =
      totalQuantity >= MAX_DISCOUNT_QUANTITY
        ? MAX_DISCOUNT_RATE
        : (totalWithoutDiscount - totalWithDiscount) / totalWithoutDiscount;

    if (discountRate === MAX_DISCOUNT_RATE) {
      totalWithDiscount = totalWithoutDiscount * (1 - MAX_DISCOUNT_RATE);
    }

    return { totalWithDiscount, discountRate };
  };

  const getTotalQuantity = () => {
    return Object.values(items).reduce(
      (total, item) => total + item.quantity,
      0,
    );
  };

  const getTotal = () => {
    const { totalWithDiscount, discountRate } = calculateDiscount();
    return { total: totalWithDiscount, discountRate: discountRate };
  };

  return {
    addItem,
    removeItem,
    updateQuantity,
    getItems,
    getItemById,
    getTotal,
  };
};
