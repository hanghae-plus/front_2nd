import { http, HttpResponse } from "msw";
import { serverURL } from "../constants";
import CouponResponse from "./coupons.json";
import ProductResponse from "./products.json";

export const handlers = [
  http.get(serverURL + "/products", () => {
    return HttpResponse.json(ProductResponse);
  }),
  http.get(serverURL + "/coupons", () => {
    return HttpResponse.json(CouponResponse);
  }),
];
