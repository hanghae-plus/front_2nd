import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProvider } from "refactoring/test/testUtils";
import OrderList from "../OrderList";

vi.mock("provider/cart/useCartContext", () => ({
  useCartContext: () => ({
    calculateTotal: () => ({
      totalBeforeDiscount: 17000,
      totalDiscount: 1500,
      totalAfterDiscount: 15500,
    }),
  }),
}));

describe("OrderList", () => {
  beforeEach(() => {
    renderWithProvider(<OrderList />);
  });

  it("상품 금액 결과를 확인할 수 있다.", () => {
    expect(screen.getByTestId("total-before-discount")).toHaveTextContent(
      "상품 금액: 17,000원",
    );
  });

  it("할인 금액 결과를 확인할 수 있다.", () => {
    expect(screen.getByTestId("total-discount")).toHaveTextContent(
      "할인 금액: 1,500원",
    );
  });

  it("최종 결제 금액 결과를 확인할 수 있다.", () => {
    expect(screen.getByTestId("total-after-discount")).toHaveTextContent(
      "최종 결제 금액: 15,500원",
    );
  });
});
