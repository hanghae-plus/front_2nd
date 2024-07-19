import { useState } from "react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { CartPage } from "../../refactoring/components/cart/CartPage";
import { AdminPage } from "../../refactoring/components/admin/AdminPage";
import { CartItem, Coupon, Discount, Product } from "../../types";
import {
  formatCouponDiscount,
  getMaxDiscount,
  getRemainingStock,
} from "../../refactoring/hooks/utils/cartUtils";
import {
  FormElement,
  useAccordion,
  useForm,
  useLocalStorage,
} from "../../refactoring/hooks";

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
      updateProduct={handleProductUpdate}
      addProduct={handleProductAdd}
      addCoupon={handleCouponAdd}
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

  // util
  describe("새로운 util함수를 만들어 보세요.", () => {
    describe("getRemainingStock", () => {
      const testProduct1: Product = {
        id: "1",
        name: "Test Product",
        price: 100,
        stock: 10,
        discounts: [
          { quantity: 2, rate: 0.1 },
          { quantity: 5, rate: 0.2 },
        ],
      };

      const testProduct2: Product = {
        id: "2",
        name: "Test Product2",
        price: 200,
        stock: 20,
        discounts: [
          { quantity: 2, rate: 0.1 },
          { quantity: 10, rate: 0.2 },
        ],
      };
      const cart1: CartItem[] = [
        {
          product: testProduct1,
          quantity: 1,
        },
      ];

      const cart2: CartItem[] = [
        {
          product: testProduct2,
          quantity: 30,
        },
      ];

      test("동일한 id를 가진 상품을 담을 때 같은 id를 가진 상품 수량 재고를 체크해야 합니다.", () => {
        expect(getRemainingStock(testProduct1, cart1)).toBe(9);
      });
      test("cart에 id와는 다른 상품이 담겼다면 최대 수량을 가지고 있어야합니다. ", () => {
        expect(getRemainingStock(testProduct2, cart1)).toBe(20);
      });
      test("오류가 나서 최대 재고를 넘어선다 해도 재고는 0으로 체크해야 합니다.", () => {
        expect(getRemainingStock(testProduct2, cart2)).toBe(0);
      });
    });

    describe("getMaxDiscount", () => {
      test("할인 목록에서 최대 할인율을 찾아야 합니다.", () => {
        const discounts: Discount[] = [
          { quantity: 2, rate: 0.1 },
          { quantity: 5, rate: 0.2 },
          { quantity: 10, rate: 0.3 },
        ];

        expect(getMaxDiscount(discounts)).toBe(0.3);
      });

      test("할인 목록이 없다면 할인율은 0이 되어야 합니다.", () => {
        const discounts: Discount[] = [];
        expect(getMaxDiscount(discounts)).toBe(0);
      });

      test("할인율은 어떠한 경우에도 음수가 나와서는 안됩니다.", () => {
        const discounts: Discount[] = [
          { quantity: 2, rate: -0.1 },
          { quantity: 10, rate: -0.05 },
        ];
        expect(getMaxDiscount(discounts)).toBe(0);
      });
    });

    describe("formatCouponDiscount", () => {
      const coupon: Coupon = {
        name: "1000원 할인 쿠폰",
        code: "AMOUNT1000",
        discountType: "amount",
        discountValue: 1000,
      };

      const coupon2: Coupon = {
        name: "10% 할인 쿠폰",
        code: "PERCENT10",
        discountType: "percentage",
        discountValue: 10,
      };

      test("discountType이 amount일 경우 ~원으로 표기합니다.", () =>
        expect(formatCouponDiscount(coupon)).toBe("1000원"));

      test("discountType이 percent일 경우 ~%로 표기합니다.", () =>
        expect(formatCouponDiscount(coupon2)).toBe("10%"));
    });
  });

  //커스텀 훅 테스트
  describe("새로운 hook 함수르 만든 후에 테스트 코드를 작성해서 실행해보세요", () => {
    //useLocalStorage
    describe("useLocalStorage", () => {
      const initialValue: CartItem[] = [];
      const testKey = "cart";

      beforeEach(() => {
        vi.spyOn(Storage.prototype, "getItem");
        vi.spyOn(Storage.prototype, "setItem");
        vi.spyOn(Storage.prototype, "removeItem");
      });

      afterEach(() => {
        vi.restoreAllMocks();
      });

      test("storedValue는 초기 값을 가져와야하며, localstorage에 key로 매핑된 데이터가 있어야합니다.", () => {
        const { result } = renderHook(() =>
          useLocalStorage<CartItem[]>(testKey, initialValue)
        );

        expect(result.current[0]).toEqual(initialValue);

        const localStorageData = JSON.parse(
          localStorage.getItem(testKey) as string
        );

        expect(localStorageData).toEqual(initialValue);
      });

      test("setStoredValue로 값을 변경합니다.", async () => {
        const { result } = renderHook(() =>
          useLocalStorage<CartItem[]>(testKey, initialValue)
        );

        const testCartItem: CartItem[] = [
          {
            product: {
              id: "p1",
              name: "상품1",
              price: 10000,
              stock: 20,
              discounts: [
                { quantity: 10, rate: 0.1 },
                { quantity: 20, rate: 0.2 },
              ],
            },
            quantity: 10,
          },
        ];

        expect(result.current[0]).toEqual(initialValue);

        await waitFor(() => act(() => result.current[1](() => testCartItem)));

        expect(result.current[0]).toEqual(testCartItem);

        const localStorageData = JSON.parse(
          localStorage.getItem(testKey) as string
        );

        expect(localStorageData).toEqual(testCartItem);
      });
    });

    describe("useForm", () => {
      const initialCoupon: Coupon = {
        name: "",
        code: "",
        discountType: "percentage",
        discountValue: 0,
      };

      const newCoupon: Coupon = {
        name: "Summer Sale",
        code: "SUMMER20",
        discountType: "amount",
        discountValue: 20,
      };

      test("주어진 초기 쿠폰 값으로 초기화해야 한다", () => {
        const {
          result: {
            current: { formState },
          },
        } = renderHook(() => useForm<Coupon>(initialCoupon));

        expect(formState).toEqual(initialCoupon);
      });

      test("태그에 매핑된 resgiter를 통해 formState 업데이트되어야 합니다.", () => {
        const { result } = renderHook(() => useForm<Coupon>(initialCoupon));

        const { register } = result.current;

        act(() => {
          register("name").onChange({
            target: { value: newCoupon.name },
          } as React.ChangeEvent<FormElement>);

          register("code").onChange({
            target: { value: newCoupon.code },
          } as React.ChangeEvent<FormElement>);

          register("discountType").onChange({
            target: { value: newCoupon.discountType },
          } as React.ChangeEvent<FormElement>);

          register("discountValue").onChange({
            target: { value: "20" },
          } as React.ChangeEvent<FormElement>);
        });

        expect(result.current.formState).toEqual(newCoupon);
      });
      test("form을 제출하면 initialData로 초기화해야 합니다.", () => {
        const { result } = renderHook(() => useForm<Coupon>(initialCoupon));

        const { register } = result.current;

        act(() => {
          register("name").onChange({
            target: { value: newCoupon.name },
          } as React.ChangeEvent<FormElement>);

          register("code").onChange({
            target: { value: newCoupon.code },
          } as React.ChangeEvent<FormElement>);

          register("discountType").onChange({
            target: { value: newCoupon.discountType },
          } as React.ChangeEvent<FormElement>);

          register("discountValue").onChange({
            target: { value: "20" },
          } as React.ChangeEvent<FormElement>);
        });

        expect(result.current.formState).toEqual(newCoupon);

        act(() => {
          result.current.submitForm({
            preventDefault: vi.fn(),
          } as unknown as React.FormEvent);
        });

        expect(result.current.formState).toEqual(initialCoupon);
      });
    });
    describe("useAccordion", () => {
      test("초기 데이터 사이즈는 0이여야 합니다.", () => {
        const { result } = renderHook(() => useAccordion());
        expect(result.current.openedAccordionId.size).toBe(0);
      });

      test("id를 추가하면 데이터set에 id를 가지고 있어야 합니다.", () => {
        const { result } = renderHook(() => useAccordion());
        act(() => {
          result.current.setAccordionId("test1");
        });
        expect(result.current.openedAccordionId.has("test1")).toBe(true);
      });

      test("기존 id를 삭제하면 데이터set에 id를 가지고 있지 않아야 합니다.", () => {
        const { result } = renderHook(() => useAccordion());
        act(() => {
          result.current.setAccordionId("test1");
        });
        expect(result.current.openedAccordionId.has("test1")).toBe(true);
        act(() => {
          result.current.setAccordionId("test1");
        });
        expect(result.current.openedAccordionId.has("test1")).toBe(false);
      });

      test("여러개의 id를 가지고 있을 수 있습니다.", () => {
        const { result } = renderHook(() => useAccordion());
        act(() => {
          result.current.setAccordionId("test1");
          result.current.setAccordionId("test2");
        });
        expect(result.current.openedAccordionId.has("test1")).toBe(true);
        expect(result.current.openedAccordionId.has("test2")).toBe(true);
        act(() => {
          result.current.setAccordionId("test1");
        });
        expect(result.current.openedAccordionId.has("test1")).toBe(false);
        expect(result.current.openedAccordionId.has("test2")).toBe(true);
      });
    });
  });
});
