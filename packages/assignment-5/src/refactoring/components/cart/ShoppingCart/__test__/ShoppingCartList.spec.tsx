import { renderWithProvider } from "refactoring/test/testUtils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ShoppingCartList from "../ShoppingCartList";
import { screen } from "@testing-library/react";

const mockUpdateQuantity = vi.fn();
const mockRemoveFromCart = vi.fn();

vi.mock("provider/cart/useCartContext", () => ({
  useCartContext: () => ({
    removeFromCart: mockRemoveFromCart,
    updateQuantity: mockUpdateQuantity,
    cartList: [{ product: { id: "p1", discounts: [] }, quantity: 1 }],
  }),
}));

vi.mock("hooks/utils/cartUtils", () => ({
  getAppliedDiscount: () => 1,
  calculateCartTotal: vi.fn(),
}));

describe("ShoppingCartList", () => {
  beforeEach(() => {
    renderWithProvider(<ShoppingCartList />);
  });
  it("마이너스 버튼을 클릭하면 수량 1개가 줄어든다.", () => {
    const minusButton = screen.getAllByTestId("minus-button")[0];
    minusButton.click();

    expect(mockUpdateQuantity).toHaveBeenCalledWith("p1", 0);
  });

  it("플러스 버튼을 클릭하면 수량 1개가 증가한다.", () => {
    const minusButton = screen.getAllByTestId("plus-button")[0];
    minusButton.click();

    expect(mockUpdateQuantity).toHaveBeenCalledWith("p1", 2);
  });

  it("삭제 버튼을 클릭하면 상품이 삭제된다.", () => {
    const removeButton = screen.getAllByTestId("remove-button")[0];
    removeButton.click();

    expect(mockRemoveFromCart).toHaveBeenCalledWith("p1");
  });

  it("적용된 할인율이 노출되어야 한다.", () => {
    expect(screen.getByTestId("discount")).toHaveTextContent(
      "(100% 할인 적용)",
    );
  });
});
