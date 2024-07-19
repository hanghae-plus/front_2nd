import CartPage from "@/refactoring/components/CartPage";
import { Coupon, Product } from "@/types";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { expect } from "vitest";

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
const mockCoupons: Coupon[] = [
  {
    name: "₩ 5,000 할인 쿠폰",
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

const CartPageTest = async () => {
  render(<CartPage products={mockProducts} coupons={mockCoupons} />);

  const product1 = screen.getByTestId("product-p1");
  const product2 = screen.getByTestId("product-p2");
  const product3 = screen.getByTestId("product-p3");
  const addToCartButtonsAtProduct1 =
    within(product1).getByText("장바구니에 추가");
  const addToCartButtonsAtProduct2 =
    within(product2).getByText("장바구니에 추가");
  const addToCartButtonsAtProduct3 =
    within(product3).getByText("장바구니에 추가");

  // 1. 상품 정보 표시
  expect(product1).toHaveTextContent("상품1");
  expect(product1).toHaveTextContent("₩ 10,000");
  expect(product1).toHaveTextContent("재고: 20개");
  expect(product2).toHaveTextContent("상품2");
  expect(product2).toHaveTextContent("₩ 20,000");
  expect(product2).toHaveTextContent("재고: 20개");
  expect(product3).toHaveTextContent("상품3");
  expect(product3).toHaveTextContent("₩ 30,000");
  expect(product3).toHaveTextContent("재고: 20개");

  // 2. 할인 정보 표시
  expect(screen.getByText("10개 이상: 10% 할인")).toBeInTheDocument();

  // 3. 상품1 장바구니에 상품 추가
  fireEvent.click(addToCartButtonsAtProduct1); // 상품1 추가

  // 4. 할인율 계산
  expect(screen.getByText("상품 금액: ₩ 10,000")).toBeInTheDocument();
  expect(screen.getByText("할인 금액: ₩ 0")).toBeInTheDocument();
  expect(screen.getByText("최종 결제 금액: ₩ 10,000")).toBeInTheDocument();

  // 5. 상품 품절 상태로 만들기
  for (let i = 0; i < 19; i++) {
    fireEvent.click(addToCartButtonsAtProduct1);
  }

  // 6. 품절일 때 상품 추가 안 되는지 확인하기
  expect(product1).toHaveTextContent("재고: 0개");
  fireEvent.click(addToCartButtonsAtProduct1);
  expect(product1).toHaveTextContent("재고: 0개");

  // 7. 할인율 계산
  expect(screen.getByText("상품 금액: ₩ 200,000")).toBeInTheDocument();
  expect(screen.getByText("할인 금액: ₩ 20,000")).toBeInTheDocument();
  expect(screen.getByText("최종 결제 금액: ₩ 180,000")).toBeInTheDocument();

  // 8. 상품을 각각 10개씩 추가하기
  fireEvent.click(addToCartButtonsAtProduct2); // 상품2 추가
  fireEvent.click(addToCartButtonsAtProduct3); // 상품3 추가

  const increaseButtons = screen.getAllByText("+");
  for (let i = 0; i < 9; i++) {
    fireEvent.click(increaseButtons[1]); // 상품2
    fireEvent.click(increaseButtons[2]); // 상품3
  }

  // 9. 할인율 계산
  expect(screen.getByText("상품 금액: ₩ 700,000")).toBeInTheDocument();
  expect(screen.getByText("할인 금액: ₩ 110,000")).toBeInTheDocument();
  expect(screen.getByText("최종 결제 금액: ₩ 590,000")).toBeInTheDocument();

  // 10. 쿠폰 적용하기
  const couponSelect = screen.getByRole("combobox");
  fireEvent.change(couponSelect, { target: { value: "1" } }); // 10% 할인 쿠폰 선택

  // 11. 할인율 계산
  expect(screen.getByText("상품 금액: ₩ 700,000")).toBeInTheDocument();
  expect(screen.getByText("할인 금액: ₩ 169,000")).toBeInTheDocument();
  expect(screen.getByText("최종 결제 금액: ₩ 531,000")).toBeInTheDocument();

  // 12. 다른 할인 쿠폰 적용하기
  fireEvent.change(couponSelect, { target: { value: "0" } }); // 5000원 할인 쿠폰
  expect(screen.getByText("상품 금액: ₩ 700,000")).toBeInTheDocument();
  expect(screen.getByText("할인 금액: ₩ 115,000")).toBeInTheDocument();
  expect(screen.getByText("최종 결제 금액: ₩ 585,000")).toBeInTheDocument();
};

export default CartPageTest;
