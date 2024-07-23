import { useState } from "react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
  within,
} from "@testing-library/react";
import { CartPage } from "../../refactoring/components/CartPage";
import { AdminPage } from "../../refactoring/components/AdminPage";
import { Coupon, Discount, Product } from "../../types";
import { useCart, useProducts } from "../../refactoring/hooks";
import {
  getAppliedDiscount,
  getMaxDiscount,
  getRemainingStock,
} from "../../refactoring/hooks/utils/cartUtils";
import useEditingProduct from "../../refactoring/hooks/useEditingProduct";
import { useProductForm } from "../../refactoring/hooks/useProductForm";
import { useDiscountForm } from "../../refactoring/hooks/useDiscountForm";
import { useCouponForm } from "../../refactoring/hooks/useCouponForm";
import { useProductAccordion } from "../../refactoring/hooks/useProductAccordion";

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

const mockProducts2: Product[] = [
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
  {
    id: "p4",
    name: "상품4",
    price: 50000,
    stock: 10,
    discounts: [
      { quantity: 5, rate: 0.1 },
      { quantity: 10, rate: 0.5 },
    ],
  },
  {
    id: "p5",
    name: "상품5",
    price: 50000,
    stock: 15,
    discounts: [
      { quantity: 3, rate: 0.1 },
      { quantity: 7, rate: 0.5 },
      { quantity: 10, rate: 0.3 },
    ],
  },
];
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

const TestAdminPage = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);

  const handleProductUpdate = (updatedProduct: Product) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const handleProductAdd = (newProduct: Product) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  const handleCouponAdd = (newCoupon: Coupon) => {
    setCoupons((prevCoupons) => [...prevCoupons, newCoupon]);
  };

  return (
    <AdminPage
      products={products}
      coupons={coupons}
      onProductUpdate={handleProductUpdate}
      onProductAdd={handleProductAdd}
      onCouponAdd={handleCouponAdd}
    />
  );
};

describe("advanced > ", () => {
  describe("시나리오 테스트 > ", () => {
    test("장바구니 페이지 테스트 > ", async () => {
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
      expect(product1).toHaveTextContent("10,000원");
      expect(product1).toHaveTextContent("재고: 20개");
      expect(product2).toHaveTextContent("상품2");
      expect(product2).toHaveTextContent("20,000원");
      expect(product2).toHaveTextContent("재고: 20개");
      expect(product3).toHaveTextContent("상품3");
      expect(product3).toHaveTextContent("30,000원");
      expect(product3).toHaveTextContent("재고: 20개");

      // 2. 할인 정보 표시
      expect(screen.getByText("10개 이상: 10% 할인")).toBeInTheDocument();

      // 3. 상품1 장바구니에 상품 추가
      fireEvent.click(addToCartButtonsAtProduct1); // 상품1 추가

      // 4. 할인율 계산
      expect(screen.getByText("상품 금액: 10,000원")).toBeInTheDocument();
      expect(screen.getByText("할인 금액: 0원")).toBeInTheDocument();
      expect(screen.getByText("최종 결제 금액: 10,000원")).toBeInTheDocument();

      // 5. 상품 품절 상태로 만들기
      for (let i = 0; i < 19; i++) {
        fireEvent.click(addToCartButtonsAtProduct1);
      }

      // 6. 품절일 때 상품 추가 안 되는지 확인하기
      expect(product1).toHaveTextContent("재고: 0개");
      fireEvent.click(addToCartButtonsAtProduct1);
      expect(product1).toHaveTextContent("재고: 0개");

      // 7. 할인율 계산
      expect(screen.getByText("상품 금액: 200,000원")).toBeInTheDocument();
      expect(screen.getByText("할인 금액: 20,000원")).toBeInTheDocument();
      expect(screen.getByText("최종 결제 금액: 180,000원")).toBeInTheDocument();

      // 8. 상품을 각각 10개씩 추가하기
      fireEvent.click(addToCartButtonsAtProduct2); // 상품2 추가
      fireEvent.click(addToCartButtonsAtProduct3); // 상품3 추가

      const increaseButtons = screen.getAllByText("+");
      for (let i = 0; i < 9; i++) {
        fireEvent.click(increaseButtons[1]); // 상품2
        fireEvent.click(increaseButtons[2]); // 상품3
      }

      // 9. 할인율 계산
      expect(screen.getByText("상품 금액: 700,000원")).toBeInTheDocument();
      expect(screen.getByText("할인 금액: 110,000원")).toBeInTheDocument();
      expect(screen.getByText("최종 결제 금액: 590,000원")).toBeInTheDocument();

      // 10. 쿠폰 적용하기
      const couponSelect = screen.getByRole("combobox");
      fireEvent.change(couponSelect, { target: { value: "1" } }); // 10% 할인 쿠폰 선택

      // 11. 할인율 계산
      expect(screen.getByText("상품 금액: 700,000원")).toBeInTheDocument();
      expect(screen.getByText("할인 금액: 169,000원")).toBeInTheDocument();
      expect(screen.getByText("최종 결제 금액: 531,000원")).toBeInTheDocument();

      // 12. 다른 할인 쿠폰 적용하기
      fireEvent.change(couponSelect, { target: { value: "0" } }); // 5000원 할인 쿠폰
      expect(screen.getByText("상품 금액: 700,000원")).toBeInTheDocument();
      expect(screen.getByText("할인 금액: 115,000원")).toBeInTheDocument();
      expect(screen.getByText("최종 결제 금액: 585,000원")).toBeInTheDocument();
    });

    test("관리자 페이지 테스트 > ", async () => {
      render(<TestAdminPage />);

      const $product1 = screen.getByTestId("product-1");

      // 1. 새로운 상품 추가
      fireEvent.click(screen.getByText("새 상품 추가"));

      fireEvent.change(screen.getByLabelText("상품명"), {
        target: { value: "상품4" },
      });
      fireEvent.change(screen.getByLabelText("가격"), {
        target: { value: "15000" },
      });
      fireEvent.change(screen.getByLabelText("재고"), {
        target: { value: "30" },
      });

      fireEvent.click(screen.getByText("추가"));

      const $product4 = screen.getByTestId("product-4");

      expect($product4).toHaveTextContent("상품4");
      expect($product4).toHaveTextContent("15000원");
      expect($product4).toHaveTextContent("재고: 30");

      // 2. 상품 선택 및 수정
      fireEvent.click($product1);
      fireEvent.click(within($product1).getByTestId("toggle-button"));
      fireEvent.click(within($product1).getByTestId("modify-button"));

      act(() => {
        fireEvent.change(within($product1).getByDisplayValue("20"), {
          target: { value: "25" },
        });
        fireEvent.change(within($product1).getByDisplayValue("10000"), {
          target: { value: "12000" },
        });
        fireEvent.change(within($product1).getByDisplayValue("상품1"), {
          target: { value: "수정된 상품1" },
        });
      });

      fireEvent.click(within($product1).getByText("수정 완료"));

      expect($product1).toHaveTextContent("수정된 상품1");
      expect($product1).toHaveTextContent("12000원");
      expect($product1).toHaveTextContent("재고: 25");

      // 3. 상품 할인율 추가 및 삭제
      fireEvent.click($product1);
      fireEvent.click(within($product1).getByTestId("modify-button"));

      // 할인 추가
      act(() => {
        fireEvent.change(screen.getByPlaceholderText("수량"), {
          target: { value: "5" },
        });
        fireEvent.change(screen.getByPlaceholderText("할인율 (%)"), {
          target: { value: "5" },
        });
      });
      fireEvent.click(screen.getByText("할인 추가"));

      expect(
        screen.queryByText("5개 이상 구매 시 5% 할인")
      ).toBeInTheDocument();

      // 할인 삭제
      fireEvent.click(screen.getAllByText("삭제")[0]);
      expect(
        screen.queryByText("10개 이상 구매 시 10% 할인")
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText("5개 이상 구매 시 5% 할인")
      ).toBeInTheDocument();

      fireEvent.click(screen.getAllByText("삭제")[0]);
      expect(
        screen.queryByText("10개 이상 구매 시 10% 할인")
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText("5개 이상 구매 시 5% 할인")
      ).not.toBeInTheDocument();

      // 4. 쿠폰 추가
      fireEvent.change(screen.getByPlaceholderText("쿠폰 이름"), {
        target: { value: "새 쿠폰" },
      });
      fireEvent.change(screen.getByPlaceholderText("쿠폰 코드"), {
        target: { value: "NEW10" },
      });
      fireEvent.change(screen.getByRole("combobox"), {
        target: { value: "percentage" },
      });
      fireEvent.change(screen.getByPlaceholderText("할인 값"), {
        target: { value: "10" },
      });

      fireEvent.click(screen.getByText("쿠폰 추가"));

      const $newCoupon = screen.getByTestId("coupon-3");

      expect($newCoupon).toHaveTextContent("새 쿠폰 (NEW10):10% 할인");
    });
  });

  describe("새로 추가한 훅과 유틸 함수 테스트 > ", () => {
    describe("새로운 유틸 함수를 만든 후에 테스트 코드를 작성해서 실행해보세요", () => {
      describe("getMaxDiscount", () => {
        test("빈 배열에 대해 0을 반환해야 합니다.", () => {
          expect(getMaxDiscount([])).toBe(0);
        });
        test("가장 높은 할인율을 반환해야 합니다.", () => {
          expect(getMaxDiscount(mockProducts2[0].discounts)).toBe(0.1);
          expect(getMaxDiscount(mockProducts2[1].discounts)).toBe(0.15);
          expect(getMaxDiscount(mockProducts2[2].discounts)).toBe(0.2);
        });
      });

      describe("getRemainingStock", () => {
        test("카트에 특정 상품이 없을 때 해당 상품의 전체 재고를 반환해야 합니다", () => {
          const { result: cartResult } = renderHook(() => useCart());
          const { result: productsResult } = renderHook(() =>
            useProducts(mockProducts2)
          );

          expect(
            getRemainingStock({
              product: productsResult.current.products[0],
              cart: cartResult.current.cart,
            })
          ).toBe(20);
        });

        test("카트에 특정 상품이 있을 때 해당 상품의 남은 재고를 정확히 계산해야 합니다", () => {
          const { result: cartResult } = renderHook(() => useCart());
          const { result: productsResult } = renderHook(() =>
            useProducts(mockProducts2)
          );
          act(() => {
            cartResult.current.addToCart(mockProducts2[0]); // quantity = 1
          });
          expect(
            getRemainingStock({
              product: productsResult.current.products[0],
              cart: cartResult.current.cart,
            })
          ).toBe(20 - 1);
        });
      });

      describe("getAppliedDiscount", () => {
        test("수량이 할인 기준에 미치지 못할 때 0을 반환해야 합니다", () => {
          const { result: cartResult } = renderHook(() => useCart());

          act(() => {
            cartResult.current.addToCart(mockProducts2[0]); // quantity = 1
          });

          const item = cartResult.current.cart[0];
          expect(getAppliedDiscount(item)).toBe(0);
        });
        test("수량에 따라 적용 가능한 최대 할인율을 반환해야 합니다", () => {
          const { result: cartResult } = renderHook(() => useCart());

          act(() => {
            cartResult.current.addToCart(mockProducts2[3]);
            cartResult.current.addToCart(mockProducts2[3]);
            cartResult.current.addToCart(mockProducts2[3]);
            cartResult.current.addToCart(mockProducts2[3]);
            cartResult.current.addToCart(mockProducts2[3]);
          });

          const item = cartResult.current.cart[0];
          expect(getAppliedDiscount(item)).toBe(0.1);
          act(() => {
            cartResult.current.addToCart(mockProducts2[3]);
            cartResult.current.addToCart(mockProducts2[3]);
            cartResult.current.addToCart(mockProducts2[3]);
            cartResult.current.addToCart(mockProducts2[3]);
            cartResult.current.addToCart(mockProducts2[3]);
          });
          const item2 = cartResult.current.cart[0];
          expect(getAppliedDiscount(item2)).toBe(0.5);
        });
        test("수량이 가장 높은 할인 기준을 초과할 때도 최대 할인율을 반환해야 합니다", () => {
          const { result: cartResult } = renderHook(() => useCart());
          act(() => {
            cartResult.current.addToCart(mockProducts2[4]);
            cartResult.current.addToCart(mockProducts2[4]);
            cartResult.current.addToCart(mockProducts2[4]);
            cartResult.current.addToCart(mockProducts2[4]);
            cartResult.current.addToCart(mockProducts2[4]);
            cartResult.current.addToCart(mockProducts2[4]);
            cartResult.current.addToCart(mockProducts2[4]);
            cartResult.current.addToCart(mockProducts2[4]);
            cartResult.current.addToCart(mockProducts2[4]);
            cartResult.current.addToCart(mockProducts2[4]);
          });

          const item = cartResult.current.cart[0];
          expect(getAppliedDiscount(item)).toBe(0.5);
        });
      });
    });

    describe("새로운 hook 함수를 만든 후에 테스트 코드를 작성해서 실행해보세요", () => {
      describe("useEditingProduct", () => {
        const onProductUpdate = vi.fn();
        const testProduct = {
          id: "1",
          name: "Test Product",
          price: 10,
          stock: 100,
          discounts: [],
        };

        test("editingProduct의 초기 상태는 null이어야 합니다", () => {
          const { result } = renderHook(() =>
            useEditingProduct(onProductUpdate)
          );
          expect(result.current.editingProduct).toEqual(null);
        });

        test("edit 함수는 상품을 설정해야 합니다", () => {
          const { result } = renderHook(() =>
            useEditingProduct(onProductUpdate)
          );
          act(() => {
            result.current.edit(testProduct);
          });
          expect(result.current.editingProduct).toEqual(testProduct);
        });
        test("editProperty 함수는 특정 속성을 업데이트해야 합니다", () => {
          const { result } = renderHook(() =>
            useEditingProduct(onProductUpdate)
          );
          act(() => {
            result.current.edit(testProduct);
            result.current.editProperty(testProduct.id, "stock", 5);
          });
          expect(result.current.editingProduct?.stock).toBe(5);
        });
        test("submit 함수는 onProductUpdate를 호출하고 editingProduct를 null로 설정해야 합니다", () => {
          const { result } = renderHook(() =>
            useEditingProduct(onProductUpdate)
          );
          act(() => {
            result.current.edit(testProduct);
            result.current.submit(testProduct);
          });
          expect(result.current.editingProduct).toEqual(null);
          expect(onProductUpdate).toHaveBeenCalledTimes(1);
        });
        test("editProperty 함수는 editingProduct가 null일 때 아무 동작도 하지 않아야 합니다", () => {
          const { result } = renderHook(() =>
            useEditingProduct(onProductUpdate)
          );
          act(() => {
            result.current.editProperty(testProduct.id, "stock", 5);
          });
          expect(result.current.editingProduct).toEqual(null);
        });
      });
      test("submit 함수는 editingProduct가 null일 때 onProductUpdate를 호출하지 않아야 합니다", () => {
        const onProductUpdate = vi.fn();
        const { result } = renderHook(() => useEditingProduct(onProductUpdate));
        act(() => {
          result.current.submit(null as any);
        });
        expect(onProductUpdate).not.toHaveBeenCalled();
      });
    });

    describe("useProductForm", () => {
      const addProduct = vi.fn();

      test("submit 함수는 onProductAdd를 호출하고 상태를 초기화해야 합니다", () => {
        const { result } = renderHook(() => useProductForm(addProduct));

        act(() => {
          result.current.submit();
        });

        expect(addProduct).toHaveBeenCalledOnce();
        expect(result.current.newProduct).toEqual({
          name: "",
          price: 0,
          stock: 0,
          discounts: [],
        });
      });
      test("setNewProduct 함수는 부분적인 업데이트를 허용해야 합니다", () => {
        const { result } = renderHook(() => useProductForm(addProduct));

        act(() => {
          result.current.setNewProduct({ name: "New Product" });
        });
        expect(result.current.newProduct).toEqual({
          name: "New Product",
          price: 0,
          stock: 0,
          discounts: [],
        });
      });
    });

    describe("useDiscountForm", () => {
      const mockUpdateProduct = vi.fn();
      const initialProducts: Product[] = [
        { id: "1", name: "Product 1", price: 100, stock: 50, discounts: [] },
        {
          id: "2",
          name: "Product 2",
          price: 200,
          stock: 30,
          discounts: [{ quantity: 10, rate: 0.1 }],
        },
      ];

      beforeEach(() => {
        mockUpdateProduct.mockClear();
      });

      test("add 함수는 유효한 할인을 추가해야 합니다", () => {
        const { result } = renderHook(() =>
          useDiscountForm(mockUpdateProduct, initialProducts)
        );

        const invalidDiscount = { quantity: 0, rate: 0.1 };
        act(() => {
          result.current.add({
            productId: "1",
            newDiscount: invalidDiscount as Discount,
          });
        });
        expect(mockUpdateProduct).not.toHaveBeenCalled();

        const validDiscount: Discount = { quantity: 25, rate: 0.25 };
        act(() => {
          result.current.add({ productId: "1", newDiscount: validDiscount });
        });
        expect(mockUpdateProduct).toHaveBeenCalledWith({
          ...initialProducts[0],
          discounts: [validDiscount],
        });
      });
      test("remove 함수는 할인을 제거해야 합니다", () => {
        const { result } = renderHook(() =>
          useDiscountForm(mockUpdateProduct, initialProducts)
        );

        act(() => {
          result.current.remove({ productId: "2", discountIndex: 0 });
        });
        expect(mockUpdateProduct).toHaveBeenCalledWith({
          ...initialProducts[1],
          discounts: [],
        });
      });
    });

    describe("useCouponForm", () => {
      const mockOnCouponAdd = vi.fn();
      const newMockCoupon: Coupon = {
        name: "Test Coupon",
        code: "TEST123",
        discountType: "percentage",
        discountValue: 10,
      };

      beforeEach(() => {
        mockOnCouponAdd.mockClear();
      });

      test("submit 함수는 유효한 쿠폰일 때 onCouponAdd를 호출하고 상태를 초기화해야 합니다", () => {
        const { result } = renderHook(() => useCouponForm(mockOnCouponAdd));

        act(() => {
          result.current.changeItem(newMockCoupon);
        });

        act(() => {
          result.current.submit();
        });

        expect(mockOnCouponAdd).toHaveBeenCalledOnce();
        expect(mockOnCouponAdd).toHaveBeenCalledWith(newMockCoupon);
        expect(result.current.coupon).toEqual({
          name: "",
          code: "",
          discountType: "percentage",
          discountValue: 0,
        });
      });

      test("submit 함수는 유효하지 않은 쿠폰일 때 onCouponAdd를 호출하지 않아야 합니다", () => {
        const { result } = renderHook(() => useCouponForm(mockOnCouponAdd));

        act(() => {
          result.current.changeItem({ ...newMockCoupon, name: "" });
        });

        act(() => {
          result.current.submit();
        });

        expect(mockOnCouponAdd).not.toHaveBeenCalled();
      });
    });

    describe("useProductAccordion", () => {
      test("toggleProductAccordion 함수는 productId를 토글해야 합니다", () => {
        const { result } = renderHook(() => useProductAccordion());
        act(() => {
          result.current.toggleProductAccordion(mockProducts[0].id);
        });
        expect(result.current.openProducts).toContain(mockProducts[0].id);
        act(() => {
          result.current.toggleProductAccordion(mockProducts[0].id);
        });
        expect(result.current.openProducts).not.toContain(mockProducts[0].id);
      });
      test("toggleProductAccordion 함수는 동일한 productId를 여러 번 토글해도 정상적으로 작동해야 합니다", () => {
        const { result } = renderHook(() => useProductAccordion());
        act(() => {
          result.current.toggleProductAccordion(mockProducts[0].id);
          result.current.toggleProductAccordion(mockProducts[0].id);
          result.current.toggleProductAccordion(mockProducts[0].id);
        });
        expect(result.current.openProducts).toContain(mockProducts[0].id);
        act(() => {
          result.current.toggleProductAccordion(mockProducts[0].id);
        });
        expect(result.current.openProducts).not.toContain(mockProducts[0].id);
      });
      test("toggleProductAccordion 함수는 여러 개의 productId를 관리할 수 있어야 합니다", () => {
        const { result } = renderHook(() => useProductAccordion());
        act(() => {
          result.current.toggleProductAccordion(mockProducts[0].id);
          result.current.toggleProductAccordion(mockProducts[1].id);
          result.current.toggleProductAccordion(mockProducts[2].id);
        });
        expect(result.current.openProducts).toContain(mockProducts[0].id);
        expect(result.current.openProducts).toContain(mockProducts[1].id);
        expect(result.current.openProducts).toContain(mockProducts[2].id);
        act(() => {
          result.current.toggleProductAccordion(mockProducts[1].id);
        });
        expect(result.current.openProducts).toContain(mockProducts[0].id);
        expect(result.current.openProducts).not.toContain(mockProducts[1].id);
        expect(result.current.openProducts).toContain(mockProducts[2].id);
      });
    });
  });
});
