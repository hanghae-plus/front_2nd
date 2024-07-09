export const createShoppingCart = () => {
  const items = {};

  /**
   * @param {{ productId: string; productName: string; price: number; discount?: [[number, number]] }} product
   * @param {number?} addCount - the count to add : optional
   */
  const addItem = (product, addCount) => {
    const { productId, productName, price, discount } = product;
    if (!items[productId]) {
      items[productId] = { product: { productId, productName, price, discount }, quantity: addCount ?? 1 };
      return;
    }
    items[productId].quantity += addCount ?? 1;
  };

  /**
   * @returns {{ product: { productId: string; productName: string; price: number }, quantity: number }[]} items array
   */
  const getItems = () => Object.values(items);

  /**
   * @param {string} productId
   */
  const removeItem = (productId) => {
    delete items[productId];
  };

  /**
   * @param {string} productId
   * @param {number} nextQuantity
   */
  const updateQuantity = (productId, nextQuantity) => {
    items[productId].quantity = nextQuantity;
    if (items[productId].quantity <= 0) {
      removeItem(productId);
    }
  };

  /**
   * @returns {{ total: number; discountRate: number }}
   */
  const getTotal = () => {
    const totalQuantity = Object.values(items).reduce((sum, { quantity }) => sum + quantity, 0);
    const totalPriceBeforeDiscount = Object.values(items).reduce(
      (sum, { product: { price }, quantity }) => sum + price * quantity,
      0,
    );
    if (totalQuantity >= 30) {
      return {
        total: totalPriceBeforeDiscount * (1 - 0.25),
        discountRate: 0.25,
      };
    }
    const totalPrice = Object.values(items).reduce((sum, { product: { price, discount }, quantity }) => {
      const [applicationQuantity, discountRate] = discount[0] || [0, 0];
      if (quantity >= applicationQuantity) {
        return sum + price * quantity * (1 - discountRate);
      }
      return sum + price * quantity;
    }, 0);
    return {
      total: totalPrice,
      discountRate: totalPrice / totalPriceBeforeDiscount,
    };
  };

  return { getItems, addItem, removeItem, updateQuantity, getTotal };
};
