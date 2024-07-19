import { describe, expect, it } from "vitest";
import { useCart } from "../useCart";
import { act, renderHook } from "@testing-library/react";
import type { Product } from "types";

const mockProducts: Product[] = [
  {
    id: "p1",
    name: "상품1",
    price: 10000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.1 }],
  },
  {
    id: "p2",
    name: "상품2",
    price: 20000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.15 }],
  },
  {
    id: "p3",
    name: "상품3",
    price: 30000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.2 }],
  },
];

describe("useCart", () => {
  describe("addToCart", () => {
    it("상품 추가를 한번 실행하면 상품 개수가 한개 더 늘어야 한다.", () => {
      const { result } = renderHook(() => useCart());
      act(() => {
        result.current.addToCart(mockProducts[0]);
      });
      expect(result.current.cartList).toEqual([
        { product: mockProducts[0], quantity: 1 },
      ]);
    });

    it("상품 추가를 실행한 만큼 상품 개수가 늘어야 한다.", () => {
      const { result } = renderHook(() => useCart());
      act(() => {
        result.current.addToCart(mockProducts[0]);
        result.current.addToCart(mockProducts[0]);
        result.current.addToCart(mockProducts[0]);
        result.current.addToCart(mockProducts[0]);
        result.current.addToCart(mockProducts[0]);
        result.current.addToCart(mockProducts[0]);
      });
      expect(result.current.cartList).toEqual([
        { product: mockProducts[0], quantity: 6 },
      ]);
    });
  });

  describe("removeFromCart", () => {
    it("리스트에서 상품이 제거되어야 한다.", () => {
      const { result } = renderHook(() => useCart());
      act(() => {
        result.current.addToCart(mockProducts[0]);
        result.current.addToCart(mockProducts[1]);
      });

      expect(result.current.cartList).toEqual([
        { product: mockProducts[0], quantity: 1 },
        { product: mockProducts[1], quantity: 1 },
      ]);

      act(() => {
        result.current.removeFromCart(mockProducts[0].id);
      });

      expect(result.current.cartList).toEqual([
        { product: mockProducts[1], quantity: 1 },
      ]);
    });
  });

  describe("updateQuantity", () => {
    it("상품 개수가 증가되어야 한다.", () => {
      const { result } = renderHook(() => useCart());
      act(() => {
        result.current.addToCart(mockProducts[0]);
      });

      expect(result.current.cartList).toEqual([
        { product: mockProducts[0], quantity: 1 },
      ]);

      act(() => {
        result.current.updateQuantity(mockProducts[0].id, 2);
      });

      expect(result.current.cartList).toEqual([
        { product: mockProducts[0], quantity: 2 },
      ]);
    });

    it("상품 개수가 0개 미만이면 업데이트되지 않는다.", () => {
      const { result } = renderHook(() => useCart());
      act(() => {
        result.current.addToCart(mockProducts[0]);
      });

      const data = [{ product: mockProducts[0], quantity: 1 }];
      expect(result.current.cartList).toEqual(data);

      act(() => {
        result.current.updateQuantity(mockProducts[0].id, -1);
      });

      expect(result.current.cartList).toEqual(data);
    });
  });

  describe("calculateTotal", () => {
    it("총 가격이 계산되어야 한다.", () => {
      const { result } = renderHook(() => useCart());
      act(() => {
        result.current.addToCart(mockProducts[0]);
        result.current.addToCart(mockProducts[0]);
        result.current.addToCart(mockProducts[0]);
      });

      expect(
        result.current.calculateTotal(result.current.cartList, null),
      ).toEqual({
        totalBeforeDiscount: 30000,
        totalAfterDiscount: 30000,
        totalDiscount: 0,
      });
    });
  });
});
