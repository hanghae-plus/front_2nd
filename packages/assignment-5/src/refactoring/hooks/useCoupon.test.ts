import { describe, expect, it } from "vitest";
import { useCoupon } from "./useCoupon";
import { act, renderHook } from "@testing-library/react";
import { Coupon } from "types";

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

describe("useCoupon", () => {
  describe("addCoupon", () => {
    it("금액 쿠폰을 추가할 수 있다", () => {
      const { result } = renderHook(() => useCoupon(mockCoupons));

      const newAmountCoupon : Coupon  = {
        name: "2000원 할인 쿠폰",
        code: "SAVE2000",
        discountType: "amount",
        discountValue: 2000,
      }

      act(() => {
        result.current.addCoupon(newAmountCoupon);
      });

      expect(result.current.coupons).toEqual([...mockCoupons, newAmountCoupon]);
    });

    it("할인율 쿠폰을 추가할 수 있다", () => {
      const { result } = renderHook(() => useCoupon(mockCoupons));

      const newPercentCoupon : Coupon  = {
        name: "15% 할인 쿠폰",
        code: "PERCENT15",
        discountType: "percentage",
        discountValue: 15,
      }

      act(() => {
        result.current.addCoupon(newPercentCoupon);
      });

      expect(result.current.coupons).toEqual([...mockCoupons, newPercentCoupon]);
    });
  });
});
