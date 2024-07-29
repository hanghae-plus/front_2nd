import { useState } from "react";
import { describe, expect, test, it } from 'vitest';
import { act, fireEvent, render, screen, within, renderHook } from '@testing-library/react';
import { CartPage, getMaxDiscount, getAppliedDiscount } from '../../refactoring/components/CartPage';
import { AdminPage } from "../../refactoring/components/AdminPage";
import { calculateRemainingStock } from '../../refactoring/hooks/useCart';
import { useEditingProduct } from '../../refactoring/hooks/useEditingProduct';
import { useLocalStorage } from '../../refactoring/hooks/useLocalStorage';
import { useCouponForm } from '../../refactoring/hooks/useCouponForm';
import { Coupon, Product } from '../../types';

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
    it('빈 배열에 대해 0을 반환해야 합니다', () => {
      expect(getMaxDiscount([])).toBe(0);
    });
  
    it('가장 높은 할인율을 반환해야 합니다', () => {
      const discounts = [
        { quantity: 2, rate: 0.1 },
        { quantity: 3, rate: 0.15 },
        { quantity: 5, rate: 0.2 }
      ];
      expect(getMaxDiscount(discounts)).toBe(0.2);
    });
  });

  describe('calculateRemainingStock', () => {
    it('카트에 상품이 없을 때 전체 재고를 반환해야 합니다', () => {
      const product: Product = { id: '1', name: 'Test Product', price: 1000, stock: 10, discounts: [] };
      const cart: CartItem[] = [];
      expect(calculateRemainingStock(product, cart)).toBe(10);
    });
  
    it('카트에 상품이 있을 때 남은 재고를 정확히 계산해야 합니다', () => {
      const product: Product = { id: '1', name: 'Test Product', price: 1000, stock: 10, discounts: [] };
      const cart: CartItem[] = [{ product: product, quantity: 3 }];
      expect(calculateRemainingStock(product, cart)).toBe(7);
    });
  });
  
  describe('getAppliedDiscount', () => {
    it('수량이 할인 기준에 미치지 못할 때 0을 반환해야 합니다', () => {
      const product: Product = {
        id: '1',
        name: 'Test Product',
        price: 1000,
        stock: 10,
        discounts: [{ quantity: 3, rate: 0.1 }]
      };
      const cartItem: CartItem = { product, quantity: 2 };
      expect(getAppliedDiscount(cartItem)).toBe(0);
    });
  
    it('수량에 따라 적용 가능한 최대 할인율을 반환해야 합니다', () => {
      const product: Product = {
        id: '1',
        name: 'Test Product',
        price: 1000,
        stock: 10,
        discounts: [
          { quantity: 3, rate: 0.1 },
          { quantity: 5, rate: 0.15 }
        ]
      };
      const cartItem: CartItem = { product, quantity: 4 };
      expect(getAppliedDiscount(cartItem)).toBe(0.1);
    });
  
    it('수량이 가장 높은 할인 기준을 초과할 때도 최대 할인율을 반환해야 합니다', () => {
      const product: Product = {
        id: '1',
        name: 'Test Product',
        price: 1000,
        stock: 10,
        discounts: [
          { quantity: 3, rate: 0.1 },
          { quantity: 5, rate: 0.15 }
        ]
      };
      const cartItem: CartItem = { product, quantity: 6 };
      expect(getAppliedDiscount(cartItem)).toBe(0.15);
    });
  });

  describe('useEditingProduct', () => {
    const mockProduct: Product = {
      id: '1',
      name: 'Test Product',
      price: 1000,
      stock: 10,
      discounts: []
    };
  
    it('초기 상태는 null이어야 합니다', () => {
      const { result } = renderHook(() => useEditingProduct());
      expect(result.current.editingProduct).toBeNull();
    });
  
    it('edit 함수는 상품을 설정해야 합니다', () => {
      const { result } = renderHook(() => useEditingProduct());
      act(() => {
        result.current.edit(mockProduct);
      });
      expect(result.current.editingProduct).toEqual(mockProduct);
    });
  
    it('updateName 함수는 상품 이름을 업데이트해야 합니다', () => {
      const { result } = renderHook(() => useEditingProduct());
      act(() => {
        result.current.edit(mockProduct);
      });
      act(() => {
        result.current.updateName('Updated Product');
      });
      expect(result.current.editingProduct?.name).toBe('Updated Product');
    });
  
    it('updatePrice 함수는 상품 가격을 업데이트해야 합니다', () => {
      const { result } = renderHook(() => useEditingProduct());
      act(() => {
        result.current.edit(mockProduct);
      });
      act(() => {
        result.current.updatePrice(1500);
      });
      expect(result.current.editingProduct?.price).toBe(1500);
    });
  
    it('updateStock 함수는 상품 재고를 업데이트해야 합니다', () => {
      const { result } = renderHook(() => useEditingProduct());
      act(() => {
        result.current.edit(mockProduct);
      });
      act(() => {
        result.current.updateStock(15);
      });
      expect(result.current.editingProduct?.stock).toBe(15);
    });
  
    it('addDiscount 함수는 새로운 할인을 추가해야 합니다', () => {
      const { result } = renderHook(() => useEditingProduct());
      act(() => {
        result.current.edit(mockProduct);
      });
      act(() => {
        result.current.setNewDiscount({ quantity: 5, rate: 0.1 });
      });
      act(() => {
        result.current.addDiscount();
      });
      expect(result.current.editingProduct?.discounts).toEqual([{ quantity: 5, rate: 0.1 }]);
    });
  
    it('removeDiscount 함수는 할인을 제거해야 합니다', () => {
      const productWithDiscount = { ...mockProduct, discounts: [{ quantity: 5, rate: 0.1 }] };
      const { result } = renderHook(() => useEditingProduct());
      act(() => {
        result.current.edit(productWithDiscount);
      });
      act(() => {
        result.current.removeDiscount(0);
      });
      expect(result.current.editingProduct?.discounts).toEqual([]);
    });
  
    it('clearEditingProduct 함수는 편집 중인 상품을 null로 설정해야 합니다', () => {
      const { result } = renderHook(() => useEditingProduct());
      act(() => {
        result.current.edit(mockProduct);
      });
      act(() => {
        result.current.clearEditingProduct();
      });
      expect(result.current.editingProduct).toBeNull();
    });
  });

  describe('useLocalStorage', () => {
    // 테스트를 위한 로컬 스토리지 모킹
    const mockLocalStorage = (() => {
      let store: { [key: string]: string } = {};
      return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
          store[key] = value.toString();
        },
        removeItem: (key: string) => {
          delete store[key];
        },
        clear: () => {
          store = {};
        }
      };
    })();

    beforeAll(() => {
      Object.defineProperty(window, 'localStorage', {
        value: mockLocalStorage
      });
    });

    beforeEach(() => {
      window.localStorage.clear();
    });

    it('초기값을 정확히 설정해야 합니다', () => {
      const { result } = renderHook(() => useLocalStorage('test', 'initial'));
      expect(result.current[0]).toBe('initial');
    });

    it('값을 업데이트하고 로컬 스토리지에 저장해야 합니다', () => {
      const { result } = renderHook(() => useLocalStorage('test', 'initial'));

      act(() => {
        result.current[1]('updated');
      });

      expect(result.current[0]).toBe('updated');
      expect(window.localStorage.getItem('test')).toBe(JSON.stringify('updated'));
    });

    it('로컬 스토리지에서 기존 값을 불러와야 합니다', () => {
      window.localStorage.setItem('test', JSON.stringify('existing'));

      const { result } = renderHook(() => useLocalStorage('test', 'initial'));
      expect(result.current[0]).toBe('existing');
    });

    it('함수를 사용하여 값을 업데이트할 수 있어야 합니다', () => {
      const { result } = renderHook(() => useLocalStorage<number>('test', 0));

      act(() => {
        result.current[1](prev => prev + 1);
      });

      expect(result.current[0]).toBe(1);
      expect(window.localStorage.getItem('test')).toBe(JSON.stringify(1));
    });

    it('객체 값을 저장하고 불러올 수 있어야 합니다', () => {
      const testObject = { name: 'Test', value: 42 };
      const { result } = renderHook(() => useLocalStorage('test', testObject));

      expect(result.current[0]).toEqual(testObject);

      act(() => {
        result.current[1]({ ...testObject, value: 43 });
      });

      expect(result.current[0]).toEqual({ name: 'Test', value: 43 });
      expect(JSON.parse(window.localStorage.getItem('test') as string)).toEqual({ name: 'Test', value: 43 });
    });
  });

  describe('useCouponForm', () => {
    const mockOnAddCoupon = vi.fn();
  
    beforeEach(() => {
      mockOnAddCoupon.mockClear();
    });
  
    it('초기 상태를 올바르게 설정해야 합니다', () => {
      const { result } = renderHook(() => useCouponForm(mockOnAddCoupon));
      expect(result.current.coupon).toEqual({
        name: '',
        code: '',
        discountType: 'percentage',
        discountValue: 0
      });
    });
  
    it('쿠폰 필드를 올바르게 업데이트해야 합니다', () => {
      const { result } = renderHook(() => useCouponForm(mockOnAddCoupon));
  
      act(() => {
        result.current.updateCouponField('name', 'Test Coupon');
      });
      expect(result.current.coupon.name).toBe('Test Coupon');
  
      act(() => {
        result.current.updateCouponField('code', 'TEST123');
      });
      expect(result.current.coupon.code).toBe('TEST123');
  
      act(() => {
        result.current.updateCouponField('discountType', 'amount');
      });
      expect(result.current.coupon.discountType).toBe('amount');
  
      act(() => {
        result.current.updateCouponField('discountValue', 1000);
      });
      expect(result.current.coupon.discountValue).toBe(1000);
    });
  
    it('handleAddCoupon 함수가 쿠폰을 추가하고 폼을 초기화해야 합니다', () => {
      const { result } = renderHook(() => useCouponForm(mockOnAddCoupon));
  
      act(() => {
        result.current.updateCouponField('name', 'Test Coupon');
        result.current.updateCouponField('code', 'TEST123');
        result.current.updateCouponField('discountType', 'amount');
        result.current.updateCouponField('discountValue', 1000);
      });
  
      act(() => {
        result.current.handleAddCoupon();
      });
  
      expect(mockOnAddCoupon).toHaveBeenCalledWith({
        name: 'Test Coupon',
        code: 'TEST123',
        discountType: 'amount',
        discountValue: 1000
      });
  
      expect(result.current.coupon).toEqual({
        name: '',
        code: '',
        discountType: 'percentage',
        discountValue: 0
      });
    });
  });

})

