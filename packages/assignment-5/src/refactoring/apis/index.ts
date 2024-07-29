import { serverURL } from "../constants";

const apis = {
  getProducts: async () => {
    const response = await fetch(serverURL + "/products");
    return await response.json().then((res) => res.data);
  },
  getCoupons: async () => {
    const response = await fetch(serverURL + "/coupons");
    return await response.json().then((res) => res.data);
  },
};

export default apis;
