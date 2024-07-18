export const generateNewDefaultProduct = () => {
  return {
    id: Date.now().toString(),
    name: "",
    price: 0,
    stock: 0,
    discounts: [],
  };
};
