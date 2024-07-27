export const createShoppingCart = () => {
  const items = {};

  const addItem = () => {};

  const removeItem = () => {};

  const updateQuantity = () => {};

  const getItems = () => [];

  const calculateDiscount = () => {
    return 0;
  };


  const getTotalQuantity = () => 0;

  const getTotal = () => ({
    total: 0,
    discountRate: 0
  });

  return { addItem, removeItem, updateQuantity, getItems, getTotal };
};
