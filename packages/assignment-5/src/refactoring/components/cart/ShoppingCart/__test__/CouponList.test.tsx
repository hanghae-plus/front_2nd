import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Coupon } from "types";
import CouponList from "../CouponList";
import { renderWithProvider } from "refactoring/test/testUtils";

const mockCoupons: Coupon[] = [
  {
    name: "5000원 할인 쿠폰",
    code: "AMOUNT5000",
    discountType: "amount",
    discountValue: 5000,
  },
  {
    name: "10% 할인 쿠폰",
    code: "PERCENT10",
    discountType: "percentage",
    discountValue: 10,
  },
];

vi.mock("provider/coupon/useCouponContext", () => ({
  useCouponContext: () => ({
    coupons: mockCoupons,
    selectedCoupon: mockCoupons[0],
    applyCoupon: vi.fn(),
  }),
}));

describe("CouponList", () => {
  beforeEach(() => {
    renderWithProvider(<CouponList />);
  });

  it("쿠폰 목록을 보여준다", () => {
    const couponSelect = screen.getByRole("combobox");
    expect(couponSelect).toBeInTheDocument();

    const option = screen.getAllByTestId("coupon-option");

    mockCoupons.forEach((coupon, i) => {
      expect(option[i]).toHaveTextContent(coupon.name);
    });
  });

  it("적용된 쿠폰을 보여준다", () => {
    const selectCoupon = screen.getByTestId("selected-coupon");

    expect(selectCoupon).toHaveTextContent(
      `적용된 쿠폰: ${mockCoupons[0].name}(${mockCoupons[0].discountValue}원 할인)`,
    );
  });
});
