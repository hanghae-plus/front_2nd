/* eslint-disable react-refresh/only-export-components */
import { PropsWithChildren, ReactElement } from "react";
import { RenderOptions, render } from "@testing-library/react";

import { CartProvider } from "refactoring/components/provider/cart";
import { CouponProvider } from "refactoring/components/provider/coupon";
import { ProductProvider } from "refactoring/components/provider/product";

import { Coupon, Product } from "types";

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

const initialCoupons: Coupon[] = [
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

const AllTheProviders = ({ children }: PropsWithChildren) => {
  return (
    <ProductProvider initialProducts={initialProducts}>
      <CouponProvider initialCoupons={initialCoupons}>
        <CartProvider>{children}</CartProvider>
      </CouponProvider>
    </ProductProvider>
  );
};

export const renderWithProvider = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => render(ui, { wrapper: AllTheProviders, ...options });
