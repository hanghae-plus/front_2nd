export const generateNewDefaultProduct = (id: string) => {
  return {
    id,
    name: "",
    price: 0,
    stock: 0,
    discounts: [],
  };
};
