import { data as DISCOUNT } from './mocks/discount.json';

export const createShoppingCart = () => {
  const items = [];
  let total = 0;
  let discountRate = 0;

  const getItemIndex = productId =>
    items.findIndex(({ product: { id } }) => id === productId);

  const addItem = (product, quantity = 1) => {
    const itemIndex = getItemIndex(product.id);

    if (itemIndex > -1) {
      items[itemIndex].quantity += 1;
    } else {
      items.push({ product, quantity });
    }

    updateContext();
  };

  const removeItem = productId => {
    items.splice(getItemIndex(productId), 1);

    updateContext();
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity === 0) {
      removeItem(productId);
    } else {
      items[getItemIndex(productId)].quantity = quantity;
    }

    updateContext();
  };

  const updateContext = () => {
    const [_total, _discountRate] = calculateCartItems();
    total = _total;
    discountRate = _discountRate;
  };

  const calculateCartItems = () => {
    const totalPrice = getTotalPriceIndividual();
    const totalQuantity = getTotalQuantity();
    const totalBeforeDiscount = getTotalBeforeDiscount();

    let total = totalPrice;
    let discountRate = (totalBeforeDiscount - totalPrice) / totalBeforeDiscount;
    const isBulkDiscount = totalQuantity >= DISCOUNT['bulk'].threshold;
    const isBulkDiscountRateBigger = DISCOUNT['bulk'].rate > discountRate;

    if (isBulkDiscount && isBulkDiscountRateBigger) {
      discountRate = DISCOUNT['bulk'].rate;
      total = calculateDiscount(totalBeforeDiscount, discountRate);
    }

    return [total, discountRate];
  };

  const calculateDiscount = (price, discountRate) => {
    return price * (1 - discountRate);
  };

  const getTotalPriceIndividual = () =>
    items.reduce(
      (acc, { product: { id, price }, quantity }) =>
        acc +
        (quantity >= DISCOUNT[id].threshold
          ? calculateDiscount(price * quantity, DISCOUNT[id].rate)
          : price * quantity),
      0,
    );

  const getTotalBeforeDiscount = () =>
    items.reduce(
      (acc, { product: { price }, quantity }) => acc + price * quantity,
      0,
    );

  const getTotalQuantity = () =>
    items.reduce((acc, { quantity }) => acc + quantity, 0);

  const getItems = () => items;

  const getTotal = () => ({ total, discountRate });

  return { addItem, removeItem, updateQuantity, getItems, getTotal };
};
