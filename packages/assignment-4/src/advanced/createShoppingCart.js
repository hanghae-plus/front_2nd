export const createShoppingCart = () => {
  const items = {};
  /* items 구조
    {prodId: {
      product: { id, name, price, discount }, 
      quantity
    }}
  */

  const addItem = (product, quantity = 1) => {
    if (items[product.id]) {
      items[product.id].quantity += quantity;
    } else {
      items[product.id] = { product, quantity };
    }
  };

  const removeItem = (id) => {
    if (items[id]) {
      delete items[id];
    }
  };

  const updateQuantity = (id, quantity) => {
    if (!items[id]) return;

    if (quantity > 0) {
      items[id].quantity = quantity;
    } else {
      removeItem(id);
    }
  };

  const getItems = () => [...Object.values(items)];

  const calculateDiscount = ([discount] = [[0, 0]], item) => {
    const [stdQuantity, rate] = discount;

    if (getTotalQuantity() >= 30) return 0.25;
    if (rate === 0) return item.quantity >= 10 ? 0.1 : 0;
    if (item.quantity >= stdQuantity) return rate;
    return 0;
  };

  const getTotalQuantity = () =>
    Object.values(items).reduce((total, item) => (total += item.quantity), 0);

  const getTotal = () => {
    let originPrice = 0;
    let totalPrice = 0;

    Object.values(items).forEach(({ product, quantity }) => {
      originPrice += product.price * quantity;
      totalPrice +=
        product.price *
        quantity *
        (1 - calculateDiscount(product.discount, { product, quantity }));
    });

    return {
      total: totalPrice,
      discountRate: (originPrice - totalPrice) / originPrice,
    };
  };

  return { addItem, removeItem, updateQuantity, getItems, getTotal };
};
