import {
  getAppliedDiscountRate,
  getMaxDiscount,
  getRemainingStock,
} from "@/refactoring/utils/cartUtils";
import { CartItem, Product } from "@/types";
import { describe, expect, test } from "vitest";

const cartUtilAdditionalTest = () => {
  const productWithDiscounts: Product = {
    id: "1",
    name: "Product with Discounts",
    price: 10000,
    stock: 20,
    discounts: [
      { quantity: 5, rate: 15 },
      { quantity: 10, rate: 20 },
    ],
  };

  const productWithoutDiscounts: Product = {
    id: "2",
    name: "Product without Discounts",
    price: 20000,
    stock: 30,
    discounts: [],
  };

  const cartWithDiscounts: CartItem = {
    product: productWithDiscounts,
    quantity: 7,
  };

  const cartWithoutDiscounts: CartItem = {
    product: productWithoutDiscounts,
    quantity: 7,
  };

  const cartWithItems: CartItem[] = [
    { product: productWithDiscounts, quantity: 5 },
    { product: productWithoutDiscounts, quantity: 2 },
  ];
  const cartWithoutItem: CartItem[] = [];

  describe("getAppliedDiscountRate 함수 테스트 >", () => {
    test("1. 할인이 적용된 경우", () => {
      const appliedDiscount = getAppliedDiscountRate(cartWithDiscounts);
      expect(appliedDiscount).toBe(15);
    });

    test("2. 할인이 적용되지 않은 경우", () => {
      const appliedDiscount = getAppliedDiscountRate(cartWithoutDiscounts);
      expect(appliedDiscount).toBe(0);
    });
  });

  describe("getMaxDiscount 함수 테스트 >", () => {
    test("1. 최대 할인이 있는 경우", () => {
      const maxDiscount = getMaxDiscount(productWithDiscounts);
      expect(maxDiscount).toBe(20);
    });

    test("2. 할인이 없는 경우", () => {
      const maxDiscount = getMaxDiscount(productWithoutDiscounts);
      expect(maxDiscount).toBe(0);
    });
  });

  describe("getRemainingStock 함수 테스트 >", () => {
    test("1. 장바구니에 상품이 있는 경우", () => {
      const remainingStockA = getRemainingStock(
        cartWithItems,
        productWithDiscounts
      );
      expect(remainingStockA).toBe(15);

      const remainingStockB = getRemainingStock(
        cartWithItems,
        productWithoutDiscounts
      );
      expect(remainingStockB).toBe(28);
    });

    test("2. 장바구니에 상품이 없는 경우", () => {
      const remainingStock = getRemainingStock(
        cartWithoutItem,
        productWithDiscounts
      );
      expect(remainingStock).toBe(20);
    });
  });
};

export default cartUtilAdditionalTest;
