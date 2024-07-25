import { useProductContext } from "../useProductContext";
import { ProductProvider } from "../index";
import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { PropsWithChildren } from "react";
import { Product } from "types";

const initialProducts: Product[] = [
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
];

describe("ProductContext", () => {
  it("Provider 없이 Context를 사용하려 할 때 에러가 발생한다.", () => {
    expect(() => renderHook(() => useProductContext())).toThrow(
      "useProductContext must be used within a ProductProvider",
    );
  });

  it("Provider가 감싸져 있으면 Context를 사용할 수 있다.", () => {
    const wrapper = ({ children }: PropsWithChildren) => (
      <ProductProvider initialProducts={initialProducts}>
        {children}
      </ProductProvider>
    );
    const { result } = renderHook(() => useProductContext(), { wrapper });
    expect(result.current.products).toEqual(initialProducts);
  });
});
