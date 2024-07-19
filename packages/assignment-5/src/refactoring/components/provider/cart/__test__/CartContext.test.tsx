import { useCartContext } from "../useCartContext";
import { CartProvider } from "../index";
import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { PropsWithChildren } from "react";

describe("CartContext", () => {
  it("Provider 없이 Context를 사용하려 할 때 에러가 발생한다.", () => {
    expect(() => renderHook(() => useCartContext())).toThrow(
      "useCartContext must be used within a CartProvider",
    );
  });

  it("Provider가 감싸져 있으면 Context를 사용할 수 있다.", () => {
    const wrapper = ({ children }: PropsWithChildren) => (
      <CartProvider>{children}</CartProvider>
    );
    const { result } = renderHook(() => useCartContext(), { wrapper });
    expect(result.current).toBeDefined();
  });
});
