import { useState } from 'react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
  within,
} from '@testing-library/react';
import { CartPage } from '../../refactoring/components/CartPage';
import { AdminPage } from '../../refactoring/components/AdminPage';
import { CartItem, Coupon, Product } from '../../types';
import { useLocalStorage } from '../../refactoring/hooks';
import * as couponUtils from '../../refactoring/hooks/utils/couponUtils';
import { useRemainCount } from '../../refactoring/hooks/useRemainCount';
import {
  calculateDiscountByCoupon,
  getRemainingStockFromCart,
} from '../../refactoring/hooks/utils/cartUtils';

const mockProducts: Product[] = [
  {
    id: 'p1',
    name: '상품1',
    price: 10000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.1 }],
  },
  {
    id: 'p2',
    name: '상품2',
    price: 20000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.15 }],
  },
  {
    id: 'p3',
    name: '상품3',
    price: 30000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.2 }],
  },
];
const mockCoupons: Coupon[] = [
  {
    name: '5000원 할인 쿠폰',
    code: 'AMOUNT5000',
    discountType: 'amount',
    discountValue: 5000,
  },
  {
    name: '10% 할인 쿠폰',
    code: 'PERCENT10',
    discountType: 'percentage',
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

  const handleCouponRemove = (couponCode: string) => {
    setCoupons((prevCoupons) =>
      prevCoupons.filter((coupon) => couponCode !== coupon.code)
    );
  };

  return (
    <AdminPage
      products={products}
      coupons={coupons}
      onProductUpdate={handleProductUpdate}
      onProductAdd={handleProductAdd}
      onCouponAdd={handleCouponAdd}
      removeCoupon={handleCouponRemove}
    />
  );
};

describe('advanced > ', () => {
  describe('시나리오 테스트 > ', () => {
    test('장바구니 페이지 테스트 > ', async () => {
      render(<CartPage products={mockProducts} coupons={mockCoupons} />);
      const product1 = screen.getByTestId('product-p1');
      const product2 = screen.getByTestId('product-p2');
      const product3 = screen.getByTestId('product-p3');
      const addToCartButtonsAtProduct1 =
        within(product1).getByText('장바구니에 추가');
      const addToCartButtonsAtProduct2 =
        within(product2).getByText('장바구니에 추가');
      const addToCartButtonsAtProduct3 =
        within(product3).getByText('장바구니에 추가');

      // 1. 상품 정보 표시
      expect(product1).toHaveTextContent('상품1');
      expect(product1).toHaveTextContent('10,000원');
      expect(product1).toHaveTextContent('재고: 20개');
      expect(product2).toHaveTextContent('상품2');
      expect(product2).toHaveTextContent('20,000원');
      expect(product2).toHaveTextContent('재고: 20개');
      expect(product3).toHaveTextContent('상품3');
      expect(product3).toHaveTextContent('30,000원');
      expect(product3).toHaveTextContent('재고: 20개');

      // 2. 할인 정보 표시
      expect(screen.getByText('10개 이상: 10% 할인')).toBeInTheDocument();

      // 3. 상품1 장바구니에 상품 추가
      fireEvent.click(addToCartButtonsAtProduct1); // 상품1 추가

      // 4. 할인율 계산
      expect(screen.getByText('상품 금액: 10,000원')).toBeInTheDocument();
      expect(screen.getByText('할인 금액: 0원')).toBeInTheDocument();
      expect(screen.getByText('최종 결제 금액: 10,000원')).toBeInTheDocument();

      // 5. 상품 품절 상태로 만들기
      for (let i = 0; i < 19; i++) {
        fireEvent.click(addToCartButtonsAtProduct1);
      }

      // 6. 품절일 때 상품 추가 안 되는지 확인하기
      expect(product1).toHaveTextContent('재고: 0개');
      fireEvent.click(addToCartButtonsAtProduct1);
      expect(product1).toHaveTextContent('재고: 0개');

      // 7. 할인율 계산
      expect(screen.getByText('상품 금액: 200,000원')).toBeInTheDocument();
      expect(screen.getByText('할인 금액: 20,000원')).toBeInTheDocument();
      expect(screen.getByText('최종 결제 금액: 180,000원')).toBeInTheDocument();

      // 8. 상품을 각각 10개씩 추가하기
      fireEvent.click(addToCartButtonsAtProduct2); // 상품2 추가
      fireEvent.click(addToCartButtonsAtProduct3); // 상품3 추가

      const increaseButtons = screen.getAllByText('+');
      for (let i = 0; i < 9; i++) {
        fireEvent.click(increaseButtons[1]); // 상품2
        fireEvent.click(increaseButtons[2]); // 상품3
      }

      // 9. 할인율 계산
      expect(screen.getByText('상품 금액: 700,000원')).toBeInTheDocument();
      expect(screen.getByText('할인 금액: 110,000원')).toBeInTheDocument();
      expect(screen.getByText('최종 결제 금액: 590,000원')).toBeInTheDocument();

      // 10. 쿠폰 적용하기
      const couponSelect = screen.getByRole('combobox');
      fireEvent.change(couponSelect, { target: { value: '1' } }); // 10% 할인 쿠폰 선택

      // 11. 할인율 계산
      expect(screen.getByText('상품 금액: 700,000원')).toBeInTheDocument();
      expect(screen.getByText('할인 금액: 169,000원')).toBeInTheDocument();
      expect(screen.getByText('최종 결제 금액: 531,000원')).toBeInTheDocument();

      // 12. 다른 할인 쿠폰 적용하기
      fireEvent.change(couponSelect, { target: { value: '0' } }); // 5000원 할인 쿠폰
      expect(screen.getByText('상품 금액: 700,000원')).toBeInTheDocument();
      expect(screen.getByText('할인 금액: 115,000원')).toBeInTheDocument();
      expect(screen.getByText('최종 결제 금액: 585,000원')).toBeInTheDocument();
    });

    test('관리자 페이지 테스트 > ', async () => {
      render(<TestAdminPage />);

      const $product1 = screen.getByTestId('product-1');

      // 1. 새로운 상품 추가
      fireEvent.click(screen.getByText('새 상품 추가'));

      fireEvent.change(screen.getByLabelText('상품명'), {
        target: { value: '상품4' },
      });
      fireEvent.change(screen.getByLabelText('가격'), {
        target: { value: '15000' },
      });
      fireEvent.change(screen.getByLabelText('재고'), {
        target: { value: '30' },
      });

      fireEvent.click(screen.getByText('추가'));

      const $product4 = screen.getByTestId('product-4');

      expect($product4).toHaveTextContent('상품4');
      expect($product4).toHaveTextContent('15000원');
      expect($product4).toHaveTextContent('재고: 30');

      // 2. 상품 선택 및 수정
      fireEvent.click($product1);
      fireEvent.click(within($product1).getByTestId('toggle-button'));
      fireEvent.click(within($product1).getByTestId('modify-button'));

      act(() => {
        fireEvent.change(within($product1).getByDisplayValue('20'), {
          target: { value: '25' },
        });
        fireEvent.change(within($product1).getByDisplayValue('10000'), {
          target: { value: '12000' },
        });
        fireEvent.change(within($product1).getByDisplayValue('상품1'), {
          target: { value: '수정된 상품1' },
        });
      });

      fireEvent.click(within($product1).getByText('수정 완료'));

      expect($product1).toHaveTextContent('수정된 상품1');
      expect($product1).toHaveTextContent('12000원');
      expect($product1).toHaveTextContent('재고: 25');

      // 3. 상품 할인율 추가 및 삭제
      fireEvent.click($product1);
      fireEvent.click(within($product1).getByTestId('modify-button'));

      // 할인 추가
      act(() => {
        fireEvent.change(screen.getByPlaceholderText('수량'), {
          target: { value: '5' },
        });
        fireEvent.change(screen.getByPlaceholderText('할인율 (%)'), {
          target: { value: '5' },
        });
      });
      fireEvent.click(screen.getByText('할인 추가'));

      expect(
        screen.queryByText('5개 이상 구매 시 5% 할인')
      ).toBeInTheDocument();

      // 할인 삭제
      fireEvent.click(screen.getAllByText('삭제')[0]);
      expect(
        screen.queryByText('10개 이상 구매 시 10% 할인')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText('5개 이상 구매 시 5% 할인')
      ).toBeInTheDocument();

      fireEvent.click(screen.getAllByText('삭제')[0]);
      expect(
        screen.queryByText('10개 이상 구매 시 10% 할인')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText('5개 이상 구매 시 5% 할인')
      ).not.toBeInTheDocument();

      // 4. 쿠폰 추가
      fireEvent.change(screen.getByPlaceholderText('쿠폰 이름'), {
        target: { value: '새 쿠폰' },
      });
      fireEvent.change(screen.getByPlaceholderText('쿠폰 코드'), {
        target: { value: 'NEW10' },
      });
      fireEvent.change(screen.getByRole('combobox'), {
        target: { value: 'percentage' },
      });
      fireEvent.change(screen.getByPlaceholderText('할인 값'), {
        target: { value: '10' },
      });

      fireEvent.click(screen.getByText('쿠폰 추가'));

      const $newCoupon = screen.getByTestId('coupon-3');

      expect($newCoupon).toHaveTextContent('새 쿠폰 (NEW10):10% 할인');
    });
  });

  describe('자유롭게 작성해보세요.', () => {
    describe('[Util] 관리자 페이지 쿠폰 삭제 테스트 >', () => {
      // 기본 쿠폰 세팅
      const coupons: Coupon[] = mockCoupons;

      test('삭제한 쿠폰을 제외한 목록 반환 >', () => {
        // 10% 할인 쿠폰 삭제
        const afterRemovedCoupon = couponUtils.removeFromCouponsByCode(
          coupons,
          'PERCENT10'
        );

        // 2개의 쿠폰이 든 mockCoupons에서 삭제한 쿠폰을 제외한 AMOUNT5000 반환
        expect(afterRemovedCoupon.length).toBe(1);
        expect(afterRemovedCoupon).toEqual([
          {
            name: '5000원 할인 쿠폰',
            code: 'AMOUNT5000',
            discountType: 'amount',
            discountValue: 5000,
          },
        ]);
      });
    });

    describe('[Util] 더 담을 수 있는 개수 체크 테스트 >', () => {
      test('현재 담긴 개수와 최대 개수를 비교해 남은 개수 반환 >', () => {
        const cart = [
          {
            product: {
              id: 'p1',
              name: '상품1',
              price: 10000,
              stock: 20,
              discounts: [{ quantity: 10, rate: 0.1 }],
            },
            quantity: 13,
          },
          {
            product: {
              id: 'p2',
              name: '상품2',
              price: 20000,
              stock: 26,
              discounts: [],
            },
            quantity: 5,
          },
          {
            product: {
              id: 'p3',
              name: '상품3',
              price: 30000,
              stock: 14,
              discounts: [],
            },
            quantity: 14,
          },
        ];
        const expectResult = [7, 21, 0];

        cart.forEach((cartItem, index) => {
          expect(getRemainingStockFromCart(cart, cartItem.product)).toBe(
            expectResult[index]
          );
        });
      });
    });

    describe('[Util] 쿠폰을 통해 할인받는 금액 반환 테스트 >', () => {
      test('쿠폰을 적용하지 않았을 때 0 반환 >', () => {
        expect(calculateDiscountByCoupon(10000, 4000, null)).toBe(0);
      });

      test('5000원 쿠폰을 적용했을 때 5000 반환 >', () => {
        const coupon: Coupon = {
          name: '쿠폰',
          code: 'COUPON5000',
          discountType: 'amount',
          discountValue: 5000,
        };
        expect(calculateDiscountByCoupon(10000, 4000, coupon)).toBe(5000);
      });

      test('10% 쿠폰을 적용했을 때 600 반환 >', () => {
        const coupon: Coupon = {
          name: '쿠폰',
          code: 'COUPON10PER',
          discountType: 'percentage',
          discountValue: 10,
        };
        expect(calculateDiscountByCoupon(10000, 4000, coupon)).toBe(600);
      });
    });

    describe('[Hook] useLocalStorage 테스트 >', () => {
      beforeEach(() => {
        localStorage.clear();
      });

      afterEach(() => {
        localStorage.clear();
      });
      const testCoupon: Coupon = {
        name: 'Test Coupon',
        code: 'TEST',
        discountType: 'percentage',
        discountValue: 10,
      };

      // ---- 상품 관련 ----
      test('새로고침 시에도 추가한 상품 기억 >', async () => {
        render(<CartPage products={mockProducts} coupons={mockCoupons} />);

        const product1 = screen.getByTestId('product-p1');
        const product2 = screen.getByTestId('product-p2');
        const product3 = screen.getByTestId('product-p3');

        const addToCartButtonsAtProduct1 =
          within(product1).getByText('장바구니에 추가');
        const addToCartButtonsAtProduct2 =
          within(product2).getByText('장바구니에 추가');
        const addToCartButtonsAtProduct3 =
          within(product3).getByText('장바구니에 추가');

        // 상품 추가 (상품1: 2, 상품2: 3, 상품3: 1)
        fireEvent.click(addToCartButtonsAtProduct1); // 상품1 추가
        fireEvent.click(addToCartButtonsAtProduct1); // 상품1 추가
        fireEvent.click(addToCartButtonsAtProduct2); // 상품2 추가
        fireEvent.click(addToCartButtonsAtProduct2); // 상품2 추가
        fireEvent.click(addToCartButtonsAtProduct2); // 상품2 추가
        fireEvent.click(addToCartButtonsAtProduct3); // 상품3 추가

        // 추가된 상품 확인(debounce 적용으로 인해 delay 추가)
        await new Promise((resolve) => setTimeout(resolve, 500));
        const cartBeforeRefresh = localStorage.getItem('cart');
        expect(JSON.parse(cartBeforeRefresh || '')?.length).toBe(3);

        // 새로고침
        render(<CartPage products={mockProducts} coupons={mockCoupons} />);

        // 새로고침 후 추가했던 상품 유지되는지 테스트
        await new Promise((resolve) => setTimeout(resolve, 500));
        const cartAfterRefresh = localStorage.getItem('cart');
        expect(JSON.parse(cartAfterRefresh || '')?.length).toBe(3);
      });

      // ---- 쿠폰 관련 ----
      test('새로고침 시에도 선택한 쿠폰 기억 >', async () => {
        const { result } = renderHook(() => useLocalStorage());

        // 쿠폰 선택
        act(() => {
          result.current.applyCoupon(testCoupon);
        });

        // 선택된 쿠폰 확인
        expect(result.current.selectedCoupon).toEqual(testCoupon);

        // 새로고침
        render(<CartPage products={mockProducts} coupons={mockCoupons} />);

        // 새로고침 후 선택했던 쿠폰 유지되는지 테스트
        expect(result.current.selectedCoupon).toEqual(testCoupon);

        //쿠폰 해제(옵션 중 '쿠폰 선택' 선택)
        act(() => {
          result.current.applyCoupon(null);
        });

        // 쿠폰 해제 확인
        expect(result.current.selectedCoupon).toEqual(null);

        // 새로고침
        render(<CartPage products={mockProducts} coupons={mockCoupons} />);

        // 새로고침 후 쿠폰 해제 상태 유지되는지 테스트
        expect(result.current.selectedCoupon).toEqual(null);
      });
    });

    describe('[Hook] useRemainCount 테스트 >', () => {
      test('현재 수량 기준 남은 다음 할인까지 남은 갯수 확인 >', () => {
        // 현재 수량은 14, 다음 할인 기준 개수는 20
        const item: CartItem = {
          product: {
            discounts: [
              { quantity: 10, rate: 0.1 },
              { quantity: 20, rate: 0.2 },
            ],
            id: 'p1',
            name: '상품1',
            price: 10000,
            stock: 40,
          },
          quantity: 14,
        };

        const { calcRemain } = useRemainCount();
        expect(calcRemain(item)).toBe(6);
      });
    });

    describe('[Hook] useCouponAddForm 테스트 >', () => {
      test('미입력 값 존재 시 쿠폰 추가 불가 >', () => {
        render(<TestAdminPage />);

        const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

        // 쿠폰 이름 입력
        fireEvent.change(screen.getByPlaceholderText('쿠폰 이름'), {
          target: { value: '새 쿠폰' },
        });

        // 쿠폰 이름만 입력 후 추가 버튼 클릭
        fireEvent.click(screen.getByText('쿠폰 추가'));

        // alert 출력, 쿠폰 목록에 추가 X
        expect(alertSpy).toHaveBeenCalled();
        expect(alertSpy).toHaveBeenCalledWith(
          '모든 값을 입력한 후에 추가해주세요.'
        );
        alertSpy.mockRestore();

        // 나머지 값 모두 입력
        fireEvent.change(screen.getByPlaceholderText('쿠폰 코드'), {
          target: { value: 'NEW10' },
        });
        fireEvent.change(screen.getByRole('combobox'), {
          target: { value: 'percentage' },
        });
        fireEvent.change(screen.getByPlaceholderText('할인 값'), {
          target: { value: '10' },
        });

        // 모든 값 입력 후 추가 버튼 클릭
        fireEvent.click(screen.getByText('쿠폰 추가'));

        const $newCoupon = screen.getByTestId('coupon-3');

        // 새 쿠폰 추가 성공
        expect($newCoupon).toHaveTextContent('새 쿠폰 (NEW10):10% 할인');
      });
    });
  });
});
