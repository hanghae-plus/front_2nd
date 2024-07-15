import { useState } from "react";
import { vi, describe, expect, test } from 'vitest';
import { act, fireEvent, render, renderHook, screen, within } from '@testing-library/react';
import { CartPage } from '../../refactoring/components/cart-page/CartPage.tsx';
import { AdminPage } from "../../refactoring/components/admin-page/AdminPage.tsx";
import { Coupon, Product } from '../../types';
import { getAppliedDiscount, getMaxDiscount, getRemainingStock } from "../../refactoring/components/cart-page/utils";
import {
  useCouponForm,
  useDiscountForm, useEditingProduct,
  useProductAccordion,
  useProductForm
} from "../../refactoring/components/admin-page/hooks";

const mockProducts: Product[] = [
  {
    id: 'p1',
    name: '상품1',
    price: 10000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.1 }]
  },
  {
    id: 'p2',
    name: '상품2',
    price: 20000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.15 }]
  },
  {
    id: 'p3',
    name: '상품3',
    price: 30000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.2 }]
  }
];
const mockCoupons: Coupon[] = [
  {
    name: '5000원 할인 쿠폰',
    code: 'AMOUNT5000',
    discountType: 'amount',
    discountValue: 5000
  },
  {
    name: '10% 할인 쿠폰',
    code: 'PERCENT10',
    discountType: 'percentage',
    discountValue: 10
  }
];

const TestAdminPage = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);


  const handleProductUpdate = (updatedProduct: Product) => {
    setProducts(prevProducts =>
      prevProducts.map(p => p.id === updatedProduct.id ? updatedProduct : p)
    );
  };

  const handleProductAdd = (newProduct: Product) => {
    setProducts(prevProducts => [...prevProducts, newProduct]);
  };

  const handleCouponAdd = (newCoupon: Coupon) => {
    setCoupons(prevCoupons => [...prevCoupons, newCoupon]);
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

describe('advanced > ', () => {

  describe('시나리오 테스트 > ', () => {

    test('장바구니 페이지 테스트 > ', async () => {

      render(<CartPage products={mockProducts} coupons={mockCoupons}/>);
      const product1 = screen.getByTestId('product-p1');
      const product2 = screen.getByTestId('product-p2');
      const product3 = screen.getByTestId('product-p3');
      const addToCartButtonsAtProduct1 = within(product1).getByText('장바구니에 추가');
      const addToCartButtonsAtProduct2 = within(product2).getByText('장바구니에 추가');
      const addToCartButtonsAtProduct3 = within(product3).getByText('장바구니에 추가');

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
      render(<TestAdminPage/>);


      const $product1 = screen.getByTestId('product-1');

      // 1. 새로운 상품 추가
      fireEvent.click(screen.getByText('새 상품 추가'));

      fireEvent.change(screen.getByLabelText('상품명'), { target: { value: '상품4' } });
      fireEvent.change(screen.getByLabelText('가격'), { target: { value: '15000' } });
      fireEvent.change(screen.getByLabelText('재고'), { target: { value: '30' } });

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
        fireEvent.change(within($product1).getByDisplayValue('20'), { target: { value: '25' } });
        fireEvent.change(within($product1).getByDisplayValue('10000'), { target: { value: '12000' } });
        fireEvent.change(within($product1).getByDisplayValue('상품1'), { target: { value: '수정된 상품1' } });
      })

      fireEvent.click(within($product1).getByText('수정 완료'));

      expect($product1).toHaveTextContent('수정된 상품1');
      expect($product1).toHaveTextContent('12000원');
      expect($product1).toHaveTextContent('재고: 25');

      // 3. 상품 할인율 추가 및 삭제
      fireEvent.click($product1);
      fireEvent.click(within($product1).getByTestId('modify-button'));

      // 할인 추가
      act(() => {
        fireEvent.change(screen.getByPlaceholderText('수량'), { target: { value: '5' } });
        fireEvent.change(screen.getByPlaceholderText('할인율 (%)'), { target: { value: '5' } });
      })
      fireEvent.click(screen.getByText('할인 추가'));

      expect(screen.queryByText('5개 이상 구매 시 5% 할인')).toBeInTheDocument();

      // 할인 삭제
      fireEvent.click(screen.getAllByText('삭제')[0]);
      expect(screen.queryByText('10개 이상 구매 시 10% 할인')).not.toBeInTheDocument();
      expect(screen.queryByText('5개 이상 구매 시 5% 할인')).toBeInTheDocument();

      fireEvent.click(screen.getAllByText('삭제')[0]);
      expect(screen.queryByText('10개 이상 구매 시 10% 할인')).not.toBeInTheDocument();
      expect(screen.queryByText('5개 이상 구매 시 5% 할인')).not.toBeInTheDocument();

      // 4. 쿠폰 추가
      fireEvent.change(screen.getByPlaceholderText('쿠폰 이름'), { target: { value: '새 쿠폰' } });
      fireEvent.change(screen.getByPlaceholderText('쿠폰 코드'), { target: { value: 'NEW10' } });
      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'percentage' } });
      fireEvent.change(screen.getByPlaceholderText('할인 값'), { target: { value: '10' } });

      fireEvent.click(screen.getByText('쿠폰 추가'));

      const $newCoupon = screen.getByTestId('coupon-3');

      expect($newCoupon).toHaveTextContent('새 쿠폰 (NEW10):10% 할인');
    })
  })

  describe('getMaxDiscount', () => {
    test('빈 배열에 대해 0을 반환해야 합니다', () => {
      expect(getMaxDiscount([])).toBe(0);
    });

    test('가장 높은 할인율을 반환해야 합니다', () => {
      const discounts = [
        { quantity: 2, rate: 0.1 },
        { quantity: 5, rate: 0.2 },
        { quantity: 10, rate: 0.15 }
      ];
      expect(getMaxDiscount(discounts)).toBe(0.2);
    });
  });

  describe('getRemainingStock', () => {
    const product: Product = {
      id: '1',
      name: 'Test Product',
      price: 100,
      stock: 20,
      discounts: []
    };

    test('카트에 상품이 없을 때 전체 재고를 반환해야 합니다', () => {
      expect(getRemainingStock(product, [])).toBe(20);
    });

    test('카트에 상품이 있을 때 남은 재고를 정확히 계산해야 합니다', () => {
      expect(getRemainingStock(product, [
        { product: { ...product }, quantity: 5 }
      ])).toBe(15);
    });
  });

  describe('getAppliedDiscount', () => {
    const product: Product = {
      id: '1',
      name: 'Test Product',
      price: 100,
      stock: 20,
      discounts: [
        { quantity: 2, rate: 0.1 },
        { quantity: 5, rate: 0.2 },
        { quantity: 10, rate: 0.3 }
      ]
    };

    test('수량이 할인 기준에 미치지 못할 때 0을 반환해야 합니다', () => {
      expect(getAppliedDiscount({ product, quantity: 1 })).toBe(0);
    });

    test('수량에 따라 적용 가능한 최대 할인율을 반환해야 합니다', () => {
      expect(getAppliedDiscount({ product, quantity: 2 })).toBe(0.1);
      expect(getAppliedDiscount({ product, quantity: 5 })).toBe(0.2);
      expect(getAppliedDiscount({ product, quantity: 10 })).toBe(0.3);
    });

    test('수량이 가장 높은 할인 기준을 초과할 때도 최대 할인율을 반환해야 합니다', () => {
      expect(getAppliedDiscount({ product, quantity: 15 })).toBe(0.3);
    });
  });

  describe('useEditingProduct', () => {
    const mockProduct: Product = {
      id: '1',
      name: 'Test Product',
      price: 100,
      stock: 10,
      discounts: []
    };

    test('초기 상태는 null이어야 합니다', () => {
      const { result } = renderHook(() => useEditingProduct(() => {}));
      expect(result.current.value).toBeNull();
    });

    test('edit 함수는 상품을 설정해야 합니다', () => {
      const { result } = renderHook(() => useEditingProduct(() => {}));
      act(() => {
        result.current.edit(mockProduct);
      });
      expect(result.current.value).toEqual(mockProduct);
    });

    test('editProperty 함수는 특정 속성을 업데이트해야 합니다', () => {
      const { result } = renderHook(() => useEditingProduct(() => {}));

      act(() => {
        result.current.edit(mockProduct);
      });
      act(() => {
        result.current.editProperty('name', 'Updated Product');
      });

      expect(result.current.value?.name).toBe('Updated Product');
    });

    test('submit 함수는 onProductUpdate를 호출하고 value를 null로 설정해야 합니다', () => {
      const mockUpdate = vi.fn();
      const { result } = renderHook(() => useEditingProduct(mockUpdate));

      act(() => {
        result.current.edit(mockProduct);
      });

      act(() => {
        result.current.submit();
      });

      expect(mockUpdate).toHaveBeenCalledWith(mockProduct);
      expect(result.current.value).toBeNull();
    });

    test('editProperty 함수는 value가 null일 때 아무 동작도 하지 않아야 합니다', () => {
      const { result } = renderHook(() => useEditingProduct(() => {}));
      act(() => {
        result.current.editProperty('name', 'Updated Product');
      });
      expect(result.current.value).toBeNull();
    });

    test('submit 함수는 value가 null일 때 onProductUpdate를 호출하지 않아야 합니다', () => {
      const mockUpdate = vi.fn();
      const { result } = renderHook(() => useEditingProduct(mockUpdate));
      act(() => {
        result.current.submit();
      });
      expect(mockUpdate).not.toHaveBeenCalled();
    });
  });

  describe('useProductForm', () => {
    test('초기 상태는 비활성화되어 있어야 합니다', () => {
      const { result } = renderHook(() => useProductForm(() => {}));
      expect(result.current.enable).toBe(false);
    });

    test('toggle 함수는 enable 상태를 전환해야 합니다', () => {
      const { result } = renderHook(() => useProductForm(() => {}));
      act(() => {
        result.current.toggle();
      });
      expect(result.current.enable).toBe(true);
    });

    test('submit 함수는 onProductAdd를 호출하고 상태를 초기화해야 합니다', () => {
      const mockAdd = vi.fn();
      const { result } = renderHook(() => useProductForm(mockAdd));
      act(() => {
        result.current.setNewProduct({ name: 'New Product', price: 200, stock: 5, discounts: [] });
        result.current.submit();
      });
      expect(mockAdd).toHaveBeenCalled();
      expect(result.current.newProduct).toEqual({ name: '', price: 0, stock: 0, discounts: [] });
      expect(result.current.enable).toBe(false);
    });

    test('setNewProduct 함수는 부분적인 업데이트를 허용해야 합니다', () => {
      const { result } = renderHook(() => useProductForm(() => {}));
      act(() => {
        result.current.setNewProduct({ ...result.current.newProduct, name: 'New Product' });
      });
      expect(result.current.newProduct).toEqual({ name: 'New Product', price: 0, stock: 0, discounts: [] });
    });
  });

  describe('useDiscountForm', () => {
    const mockProduct: Product = {
      id: '1',
      name: 'Test Product',
      price: 100,
      stock: 10,
      discounts: []
    };

    test('add 함수는 유효한 할인을 추가해야 합니다', () => {
      const mockUpdate = vi.fn();
      const mockEdit = vi.fn();
      const { result } = renderHook(() => useDiscountForm(mockUpdate, { value: mockProduct, edit: mockEdit }));

      act(() => {
        result.current.setNewDiscount({ quantity: 5, rate: 0.1 });
      });

      act(() => {
        result.current.add(mockProduct);
      });

      expect(mockEdit).toHaveBeenCalledWith({ ...mockProduct, discounts: [{ quantity: 5, rate: 0.1 }] });
      expect(mockUpdate).toHaveBeenCalledWith({ ...mockProduct, discounts: [{ quantity: 5, rate: 0.1 }] });
    });

    test('remove 함수는 할인을 제거해야 합니다', () => {
      const productWithDiscount = { ...mockProduct, discounts: [{ quantity: 5, rate: 0.1 }] };
      const mockUpdate = vi.fn();
      const mockEdit = vi.fn();
      const { result } = renderHook(() => useDiscountForm(mockUpdate, { value: productWithDiscount, edit: mockEdit }));

      act(() => {
        result.current.remove(productWithDiscount, 0);
      });

      expect(mockEdit).toHaveBeenCalledWith({ ...productWithDiscount, discounts: [] });
      expect(mockUpdate).toHaveBeenCalledWith({ ...productWithDiscount, discounts: [] });
    });

  });

  describe('useCouponForm', () => {
    test('submit 함수는 유효한 쿠폰일 때 onCouponAdd를 호출하고 상태를 초기화해야 합니다', () => {
      const mockAdd = vi.fn();
      const { result } = renderHook(() => useCouponForm(mockAdd));

      act(() => {
        result.current.edit({ name: 'New Coupon', code: 'NEW10', discountType: 'percentage', discountValue: 10 });
      });

      act(() => {
        result.current.submit();
      });

      expect(mockAdd).toHaveBeenCalledWith({ name: 'New Coupon', code: 'NEW10', discountType: 'percentage', discountValue: 10 });
      expect(result.current.value).toEqual({ name: '', code: '', discountType: 'percentage', discountValue: 0 });
    });
  });

  describe('useProductAccordion', () => {
    test('toggleProductAccordion 함수는 productId를 토글해야 합니다', () => {
      const { result } = renderHook(() => useProductAccordion());
      act(() => {
        result.current.toggleProductAccordion('1');
      });
      expect(result.current.openProductIds.has('1')).toBe(true);
      act(() => {
        result.current.toggleProductAccordion('1');
      });
      expect(result.current.openProductIds.has('1')).toBe(false);
    });

    test('toggleProductAccordion 함수는 동일한 productId를 여러 번 토글해도 정상적으로 작동해야 합니다', () => {
      const { result } = renderHook(() => useProductAccordion());
      act(() => {
        result.current.toggleProductAccordion('1');
        result.current.toggleProductAccordion('1');
        result.current.toggleProductAccordion('1');
      });
      expect(result.current.openProductIds.has('1')).toBe(true);
    });

    test('toggleProductAccordion 함수는 여러 개의 productId를 관리할 수 있어야 합니다', () => {
      const { result } = renderHook(() => useProductAccordion());
      act(() => {
        result.current.toggleProductAccordion('1');
        result.current.toggleProductAccordion('2');
        result.current.toggleProductAccordion('3');
      });
      expect(result.current.openProductIds.size).toBe(3);
      expect(result.current.openProductIds.has('1')).toBe(true);
      expect(result.current.openProductIds.has('2')).toBe(true);
      expect(result.current.openProductIds.has('3')).toBe(true);
    });
  });

})

