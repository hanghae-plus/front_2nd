import { describe, expect, it } from "vitest";
import {
  calculateDiscount,
  calculateDiscountRate,
  calculateDiscountedTotal,
  findProduct,
  getQuantityByCartItem,
} from "../utils";

const DISCOUNT_PERCENT = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
};

describe("utils", () => {
  describe("findProduct", () => {
    it("id를 통해 product를 찾을 수 있다.", () => {
      const product = [
        { id: "p1", name: "product1", price: 1000 },
        { id: "p2", name: "product2", price: 2000 },
      ];
      const selectedId = "p1";

      const result = findProduct({ product, selectedId });

      expect(result).toEqual(product[0]);
    });
  });

  describe("calculateDiscountedTotal", () => {
    it("할인된 총액을 계산할 수 있다.", () => {
      const price = 1000;
      const quantity = 2;
      const discount = 0.1;

      const result = calculateDiscountedTotal({ price, quantity, discount });

      expect(result).toBe(1800);
    });

    it("discount가 없으면 할인이 적용되지 않는다.", () => {
      const price = 1000;
      const quantity = 2;

      const result = calculateDiscountedTotal({ price, quantity });

      expect(result).toBe(2000);
    });
  });

  describe("calculateDiscount", () => {
    it.each(Object.keys(DISCOUNT_PERCENT))(
      "상품 개수가 30개 미만이면 %s의 할인율이 적용된다.",
      (productId) => {
        const result = calculateDiscount({ quantity: 29, productId });

        expect(result).toBe(DISCOUNT_PERCENT[productId]);
      },
    );
  });

  describe("getQuantityByCartItem", () => {
    it("상품 개수를 가져올 수 있다.", () => {
      const cartItem = document.createElement("div");
      const itemInfo = document.createElement("span");
      itemInfo.textContent = "상품1 - 1000원 x 2";
      cartItem.appendChild(itemInfo);

      const result = getQuantityByCartItem(cartItem);

      expect(result).toBe(2);
    });
  });

  describe("calculateDiscountRate", () => {
    it("상품 개수가 30개 이상이면 25%의 할인율이 적용된다.", () => {
      const result = calculateDiscountRate({ totalQuantity: 30 });

      expect(result).toBe(0.25);
    });

    it("30개 미만이면 할인율이 계산된다.", () => {
      const prevTotal = 1000;
      const originalTotal = 800;
      const totalQuantity = 10;

      const result = calculateDiscountRate({
        totalQuantity,
        prevTotal,
        originalTotal,
      });

      expect(result).toBe(0.2);
    });
  });
});
