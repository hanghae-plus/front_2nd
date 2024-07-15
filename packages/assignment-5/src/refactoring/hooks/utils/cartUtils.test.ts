import { describe, expect, it } from "vitest";
import {
  calculateCartTotal,
  calculateCouponDiscountPrice,
  calculateItemTotal,
  getMaxApplicableDiscount,
  updateCartItemQuantity,
} from "./cartUtils";
import { Coupon } from "types";

describe("cartUtils", () => {
  describe("calculateItemTotal", () => {
    it("할인율이 없는 총합을 반환한다.", () => {
      const item = {
        product: {
          id: "p1",
          name: "item1",
          stock: 10,
          price: 1000,
          discounts: [],
        },
        quantity: 2,
      };

      const result = calculateItemTotal(item);

      expect(result).toBe(2000);
    });

    it("할인율이 있는 총합을 반환한다.", () => {
      const item = {
        product: {
          id: "p1",
          name: "item1",
          stock: 10,
          price: 1000,
          discounts: [{ quantity: 2, rate: 0.1 }],
        },
        quantity: 2,
      };

      const result = calculateItemTotal(item);

      expect(result).toBe(1800); // 2000 * 0.1 할인 적용
    });
  });

  describe("getMaxApplicableDiscount", () => {
    it("빈 배열에 대해 0을 반환해야 합니다.", () => {
      const item = {
        product: {
          id: "p1",
          name: "item1",
          stock: 10,
          price: 1000,
          discounts: [],
        },
        quantity: 2,
      };

      const result = getMaxApplicableDiscount(item);

      expect(result).toBe(0);
    });

    it("최대 할인율을 반환한다.", () => {
      const item = {
        product: {
          id: "p1",
          name: "item1",
          stock: 10,
          price: 1000,
          discounts: [
            { quantity: 2, rate: 0.1 },
            { quantity: 4, rate: 0.2 },
          ],
        },
        quantity: 4,
      };

      const result = getMaxApplicableDiscount(item);

      expect(result).toBe(0.2);
    });
  });

  describe("calculateCouponDiscountPrice", () => {
    it("할인율이 amount인 경우 할인된 가격을 반환한다.", () => {
      const result = calculateCouponDiscountPrice({
        discountPrice: 1000,
        coupon: {
          discountType: "amount",
          discountValue: 100,
          name: "",
          code: "",
        },
        totalBeforeDiscount: 2000,
      });

      expect(result).toBe(1100); // 1000 + 100
    });

    it("할인율이 percentage인 경우 할인된 가격을 반환한다.", () => {
      const result = calculateCouponDiscountPrice({
        discountPrice: 1000,
        coupon: {
          discountType: "percentage",
          discountValue: 50,
          name: "",
          code: "",
        },
        totalBeforeDiscount: 2000,
      });

      expect(result).toBe(1500); // 1000 * 0.5 -> 500,  500 + 1000
    });
  });

  describe("calculateCartTotal", () => {
    it("쿠폰을 적용하지 않은 총합을 반환한다.", () => {
      const cart = [
        {
          product: {
            id: "p1",
            name: "item1",
            stock: 10,
            price: 1000,
            discounts: [],
          },
          quantity: 2,
        },
        {
          product: {
            id: "p2",
            name: "item2",
            stock: 10,
            price: 2000,
            discounts: [],
          },
          quantity: 1,
        },
      ];

      const result = calculateCartTotal({ cart, selectedCoupon: null });

      expect(result.totalBeforeDiscount).toBe(4000);
      expect(result.totalAfterDiscount).toBe(4000);
      expect(result.totalDiscount).toBe(0);
    });

    it("쿠폰을 적용한 총합을 반환한다.", () => {
      const cart = [
        {
          product: {
            id: "p1",
            name: "item1",
            stock: 10,
            price: 1000,
            discounts: [],
          },
          quantity: 2,
        },
        {
          product: {
            id: "p2",
            name: "item2",
            stock: 10,
            price: 2000,
            discounts: [],
          },
          quantity: 1,
        },
      ];

      const coupon: Coupon = {
        discountType: "amount",
        discountValue: 1000,
        name: "",
        code: "",
      };

      const result = calculateCartTotal({ cart, selectedCoupon: coupon });

      expect(result.totalBeforeDiscount).toBe(4000);
      expect(result.totalAfterDiscount).toBe(3000);
      expect(result.totalDiscount).toBe(1000);
    });
  });

  describe("updateCartItemQuantity", () => {
    it("수량이 0 이하인 경우 해당 상품을 제거한다.", () => {
      const cart = [
        {
          product: {
            id: "p1",
            name: "item1",
            stock: 10,
            price: 1000,
            discounts: [],
          },
          quantity: 2,
        },
        {
          product: {
            id: "p2",
            name: "item2",
            stock: 10,
            price: 2000,
            discounts: [],
          },
          quantity: 1,
        },
      ];

      const result = updateCartItemQuantity({
        cartList: cart,
        productId: "p1",
        newQuantity: 0,
      });

      expect(result.length).toBe(1);
      expect(result[0].product.id).toBe("p2");

      const result1 = updateCartItemQuantity({
        cartList: cart,
        productId: "p2",
        newQuantity: -1,
      });
      expect(result1[0].product.id).toBe("p1");
    });

    it("상품 수량을 업데이트 할 수 있다.", () => {
      const cart = [
        {
          product: {
            id: "p1",
            name: "item1",
            stock: 10,
            price: 1000,
            discounts: [],
          },
          quantity: 2,
        },
      ];

      const result = updateCartItemQuantity({
        cartList: cart,
        productId: "p1",
        newQuantity: 3,
      });

      expect(result[0].quantity).toBe(3);
    });

    it("수량이 상품의 재고보다 많은 경우 재고 수량으로 조정한다.", () => {
      const cart = [
        {
          product: {
            id: "p1",
            name: "item1",
            stock: 10,
            price: 1000,
            discounts: [],
          },
          quantity: 2,
        },
      ];

      const result = updateCartItemQuantity({
        cartList: cart,
        productId: "p1",
        newQuantity: 20,
      });

      expect(result[0].quantity).toBe(10);
    });
  });
});
