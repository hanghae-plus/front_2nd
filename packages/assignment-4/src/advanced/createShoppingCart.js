export const createShoppingCart = () => {
  const items = [];

  const findIndexById = id =>
    items.findIndex(({ product }) => product.id === id);

  const addItem = (item, quantity) => {
    const cartItemIdx = findIndexById(item.id);

    if (cartItemIdx === -1) {
      items.push({ product: item, quantity: quantity ?? 1 });
    } else {
      items[cartItemIdx].quantity += 1;
    }
  };

  const removeItem = id => {
    const cartItemIdx = findIndexById(id);

    if (cartItemIdx === -1) return;

    items.splice(cartItemIdx, 1);
  };

  const updateQuantity = (id, newQuantity) => {
    const cartItemIdx = findIndexById(id);

    if (cartItemIdx === -1) return;

    if (newQuantity) {
      items[cartItemIdx].quantity = newQuantity;
    } else {
      items.splice(cartItemIdx, 1);
    }
  };

  const getItems = () => items;

  // const calculateDiscount = () => {
  //   return 0;
  // };

  // const getTotalQuantity = () => 0;

  const getTotal = () => {
    let total = 0; // 총합
    let totalQuantity = 0; // 총 개수
    let originalTotal = 0; // 할인 전 총액

    items.forEach(({ product, quantity }) => {
      const itemTotal = product.price * quantity;

      let discount = 0;

      totalQuantity += quantity;
      originalTotal += itemTotal;

      if (product.discount && quantity >= product.discount[0][0]) {
        discount = product.discount[0][1];
      }

      total += itemTotal * (1 - discount);
    });

    let discountRate = 0;

    if (totalQuantity >= 30) {
      const bulkDiscount = originalTotal * 0.25;
      const individualDiscount = originalTotal - total;
      if (bulkDiscount > individualDiscount) {
        total = originalTotal * 0.75;
        discountRate = 0.25;
      } else {
        discountRate = individualDiscount / originalTotal;
      }
    } else {
      discountRate = (originalTotal - total) / originalTotal;
    }

    return { total, discountRate };
  };

  return { addItem, removeItem, updateQuantity, getItems, getTotal };
};
