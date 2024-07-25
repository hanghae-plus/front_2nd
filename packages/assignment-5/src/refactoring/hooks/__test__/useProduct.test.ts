import { describe, expect, it } from "vitest";
import { useProduct } from "../useProduct";
import { act, renderHook } from "@testing-library/react";
import { Product } from "types";

const mockProducts: Product[] = [
  {
    id: "p1",
    name: "상품1",
    price: 10000,
    stock: 20,
    discounts: [
      { quantity: 10, rate: 0.1 },
      { quantity: 20, rate: 0.2 },
    ],
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

describe("useProduct", () => {
  describe("addProduct", () => {
    it("상품을 추가할 수 있다.", () => {
      const { result } = renderHook(() => useProduct(mockProducts));

      const newProduct: Product = {
        id: "p4",
        name: "상품4",
        price: 30000,
        stock: 20,
        discounts: [{ quantity: 10, rate: 0.2 }],
      };
      act(() => {
        result.current.addProduct(newProduct);
      });

      expect(result.current.products).toEqual([...mockProducts, newProduct]);
    });
  });

  describe("updateProduct", () => {
    it("상품을 수정할 수 있다.", () => {
      const { result } = renderHook(() => useProduct(mockProducts));

      const updatedProduct: Product = {
        id: "p1",
        name: "상품1",
        price: 20000,
        stock: 20,
        discounts: [
          { quantity: 10, rate: 0.1 },
          { quantity: 20, rate: 0.2 },
        ],
      };

      act(() => {
        result.current.updateProduct(updatedProduct);
      });

      expect(result.current.products).toEqual([
        updatedProduct,
        mockProducts[1],
        mockProducts[2],
      ]);
    });
  });
});
