import { useCouponContext } from "../useCouponContext";
import { CouponProvider } from "../index";
import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { PropsWithChildren } from "react";
import { Coupon } from "types";

const initialCoupons: Coupon[] = [
  {
    name: "5000원 할인 쿠폰",
    code: "AMOUNT5000",
    discountType: "amount",
    discountValue: 5000,
  },
];

describe("CouponContext", () => {
  it("Provider 없이 Context를 사용하려 할 때 에러가 발생한다.", () => {
    expect(() => renderHook(() => useCouponContext())).toThrow(
      "useCouponContext must be used within a CouponProvider",
    );
  });

  it("Provider가 감싸져 있으면 Context를 사용할 수 있다.", () => {
    const wrapper = ({ children }: PropsWithChildren) => (
      <CouponProvider initialCoupons={initialCoupons}>
        {children}
      </CouponProvider>
    );
    const { result } = renderHook(() => useCouponContext(), { wrapper });
    expect(result.current.coupons).toEqual(initialCoupons);
  });
});
