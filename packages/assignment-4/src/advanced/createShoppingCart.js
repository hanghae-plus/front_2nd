export const createShoppingCart = () => {
  const items = {};

  const addItem = (product, quantity = 1) => {
    if (items[product.id]) {
      items[product.id].quantity += quantity;
    } else {
      items[product.id] = { product, quantity };
    }
  };

  const removeItem = (productId) => {
    delete items[productId];
  };

  const updateQuantity = (productId, quantity) => {
    if (!quantity) {
      delete items[productId];
      return;
    }
    items[productId].quantity = quantity;
    console.log({ quantity });
  };

  const getItems = () => {
    return Object.values(items);
  };

  const getTotalQuantity = () => {
    return Object.values(items).reduce(
      (accumulator, item) => accumulator + item.quantity,
      0,
    );
  };

  const getTotalBeforeDiscount = () => {
    return Object.values(items).reduce(
      (accumulator, item) => accumulator + item.product.price * item.quantity,
      0,
    );
  };

  const PRODUCT_DISCOUNT_RATES = {
    p1: 0.1,
    p2: 0.15,
    p3: 0.2,
    bulk: 0.25,
  };

  const MINIMUM_DISCOUNT_QUANTITY = 10;
  const BULK_QUANTITY_THRESHOLD = 30;

  const calculateDiscount = (
    itemsArray,
    totalBeforeDiscount,
    totalQuantity,
  ) => {
    let individualDiscountedTotal = 0;
    let totalDiscountAmount = 0;

    for (const item of itemsArray) {
      const { product, quantity } = item;
      const discountRate =
        quantity >= MINIMUM_DISCOUNT_QUANTITY
          ? PRODUCT_DISCOUNT_RATES[product.id]
          : 0;

      const discountedPrice = product.price * quantity * (1 - discountRate);
      individualDiscountedTotal += discountedPrice;
      totalDiscountAmount += product.price * quantity * discountRate;
    }

    let bulkDiscountedTotal = totalBeforeDiscount;
    let bulkDiscountAmount = 0;
    if (totalQuantity >= BULK_QUANTITY_THRESHOLD) {
      bulkDiscountedTotal =
        totalBeforeDiscount * (1 - PRODUCT_DISCOUNT_RATES.bulk);
      bulkDiscountAmount = totalBeforeDiscount * PRODUCT_DISCOUNT_RATES.bulk;
    }

    let total = individualDiscountedTotal;
    let appliedDiscount = 'individual';
    let discountRate = totalDiscountAmount / totalBeforeDiscount;

    if (individualDiscountedTotal > bulkDiscountedTotal) {
      total = bulkDiscountedTotal;
      appliedDiscount = 'bulk';
      discountRate = bulkDiscountAmount / totalBeforeDiscount;
    }

    return { total, appliedDiscount, discountRate };
  };

  const getTotal = () => {
    const itemsArray = getItems();
    let totalBeforeDiscount = getTotalBeforeDiscount();
    let totalQuantity = getTotalQuantity();

    return calculateDiscount(itemsArray, totalBeforeDiscount, totalQuantity);
  };

  return { addItem, removeItem, updateQuantity, getItems, getTotal };
};
