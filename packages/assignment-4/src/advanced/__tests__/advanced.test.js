import { describe, it, expect, beforeEach, beforeAll, vi } from "vitest";
import { ProductOption, MainLayout, CartItem, CartTotal } from '../templates.js'
import { createShoppingCart } from "../createShoppingCart.js";

describe('advanced test', () => {

  describe.each([
    { type: 'origin', loadFile: () => import('../../main.js'), },
    { type: 'advanced', loadFile: () => import('../main.advanced.js'), },
  ])('$type 장바구니 시나리오 테스트', ({ loadFile }) => {

    beforeAll(async () => {
      // DOM 초기화
      document.body.innerHTML = '<div id="app"></div>';
      await loadFile();
    });

    it('장바구니 전체 기능 시나리오', async () => {
      // 초기 레이아웃 렌더링 확인
      expect(document.body.innerHTML).toContain('장바구니');
      expect(document.querySelector('#product-select')).not.toBeNull();
      expect(document.querySelector('#add-to-cart')).not.toBeNull();

      // 상품을 장바구니에 추가
      const select = document.querySelector('#product-select');
      const addButton = document.querySelector('#add-to-cart');

      select.value = 'p1';
      addButton.click();
      select.value = 'p2';
      addButton.click();
      select.value = 'p1';
      addButton.click();

      // 장바구니 내역 조회 및 검증
      await vi.waitFor(() => {
        const cartItems = document.querySelectorAll('#cart-items > div');
        expect(cartItems.length).toBe(2);
        expect(cartItems[0].textContent).toContain('상품1');
        expect(cartItems[0].textContent).toContain('x 2');
        expect(cartItems[1].textContent).toContain('상품2');
        expect(cartItems[1].textContent).toContain('x 1');
        const cartTotal = document.querySelector('#cart-total');
        expect(cartTotal.innerHTML).toContain('총액: 40000원');
        // 할인이 적용되지 않았으므로 할인 문구가 없어야 함
        expect(cartTotal.innerHTML).not.toContain('할인 적용');
      });

      // 상품 수량 변경
      document.querySelectorAll('.quantity-change[data-change="1"]')[1].click();

      // 변경된 수량 및 총액 검증
      await vi.waitFor(() => {
        const cartItems = document.querySelectorAll('#cart-items > div');
        expect(cartItems[1].textContent).toContain('x 2');
        const cartTotal = document.querySelector('#cart-total');
        expect(cartTotal.textContent).toContain('총액: 60000원');
        // 아직 할인 조건을 만족하지 않으므로 할인 문구가 없어야 함
        expect(cartTotal.innerHTML).not.toContain('할인 적용');
      });

      // 할인 조건을 만족시키기 위해 상품1을 8개 더 추가 (총 10개)
      for (let i = 0; i < 8; i++) {
        select.value = 'p1';
        addButton.click();
      }

      // 할인이 적용된 상태 검증
      await vi.waitFor(() => {
        const cartItems = document.querySelectorAll('#cart-items > div');
        expect(cartItems[0].textContent).toContain('x 10');
        const cartTotal = document.querySelector('#cart-total');
        expect(cartTotal.textContent).toContain('총액: 130000원'); // (10000 * 10 * 0.9) + (20000 * 2) = 130000
        expect(cartTotal.innerHTML).toContain('할인 적용');
        expect(cartTotal.innerHTML).toContain('7.1% 할인 적용'); // (140000 - 130000) / 140000 ≈ 7.14%, 반올림하여 7.1%
      });

      // 상품 제거
      const removeButton = document.querySelector('.remove-item[data-product-id="p1"]');
      removeButton.click();

      // 제거 후 장바구니 상태 검증
      await vi.waitFor(() => {
        const cartItems = document.querySelectorAll('#cart-items > div');
        expect(cartItems.length).toBe(1);
        expect(cartItems[0].textContent).toContain('상품2');
        const cartTotal = document.querySelector('#cart-total');
        expect(cartTotal.textContent).toContain('총액: 40000원');
        // 할인 조건을 만족하지 않으므로 할인 문구가 없어야 함
        expect(cartTotal.innerHTML).not.toContain('할인 적용');
      });

      // 수량을 0으로 변경하여 상품 제거
      for (let i = 0; i < 2; i++) {
        document.querySelector('.quantity-change[data-change="-1"]').click();
      }

      // 장바구니가 비어있는지 검증
      await vi.waitFor(() => {
        const cartItems = document.querySelectorAll('#cart-items > div');
        expect(cartItems.length).toBe(0);
        expect(document.querySelector('#cart-total').textContent.trim()).toBe('총액: 0원');
      });

      // 새로운 상품 추가 - 할인 조건을 만족시키기 위해 상품3을 10개 추가
      select.value = 'p3';
      for (let i = 0; i < 10; i++) {
        addButton.click();
      }

      // 장바구니 상태 검증
      await vi.waitFor(() => {
        const cartItems = document.querySelectorAll('#cart-items > div');
        expect(cartItems.length).toBe(1);
        expect(cartItems[0].textContent).toContain('상품3');
        expect(cartItems[0].textContent).toContain('x 10');
        const cartTotal = document.querySelector('#cart-total');
        expect(cartTotal.textContent).toContain('총액: 240000원'); // 30000 * 10 * 0.8 = 240000
        expect(cartTotal.innerHTML).toContain('20.0% 할인 적용');
      });

      // 새로운 상품 추가 - 25% 할인 조건을 만족시키기 위해 상품1, 상품2를 각각 10개 추가
      select.value = 'p1';
      for (let i = 0; i < 10; i++) {
        addButton.click();
      }

      select.value = 'p2';
      for (let i = 0; i < 10; i++) {
        addButton.click();
      }

      // 최종 장바구니 상태 검증
      await vi.waitFor(() => {
        const cartItems = document.querySelectorAll('#cart-items > div');
        expect(cartItems.length).toBe(3);
        expect(cartItems[0].textContent).toContain('상품3 - 30000원 x 10');
        expect(cartItems[1].textContent).toContain('상품1 - 10000원 x 10');
        expect(cartItems[2].textContent).toContain('상품2 - 20000원 x 10');
        const cartTotal = document.querySelector('#cart-total');
        expect(cartTotal.textContent).toContain('총액: 450000원'); // 30000 * 10 * 0.8 = 240000
        expect(cartTotal.innerHTML).toContain('25.0% 할인 적용');
      });
    });
  });

  describe('Templates > ', () => {
    describe('ProductOption', () => {
      it('props를 받아서 option 태그로 표현할 수 있다.', () => {
        const product = { id: 'p1', name: '상품1', price: 10000 };
        const result = ProductOption(product);
        expect(result).toBe('<option value="p1">상품1 - 10000원</option>');
      });
    });

    describe('MainLayout', () => {
      it('items를 토대로 렌더링할 수 있다.', () => {
        const items = [
          { id: 'id1', name: '테스트 상품 1', price: 100 },
          { id: 'id2', name: '테스트 상품 2', price: 200 }
        ];
        const result = MainLayout({ items });
        expect(result).toBe(`<div class="bg-gray-100 p-8">
    <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
      <h1 class="text-2xl font-bold mb-4">장바구니</h1>
        <div id="cart-items"></div>
        <div id="cart-total" class="text-xl font-bold my-4"></div>
        <select id="product-select" class="border rounded p-2 mr-2">
        <option value="id1">테스트 상품 1 - 100원</option><option value="id2">테스트 상품 2 - 200원</option>
      </select>
        <button id="add-to-cart" class="bg-blue-500 text-white px-4 py-2 rounded">추가</button>
    </div>
  </div>`);
      });
    });

    describe('CartItem', () => {
      it('상품 정보를 받아서 장바구니 UI로 표현한다.', () => {
        const item = { product: { id: 'p1', name: '상품1', price: 10000 }, quantity: 2 };
        const result = CartItem(item);
        expect(result).toBe(`<div class="flex justify-between items-center mb-2">
    <span>상품1 - 10000원 x 2</span>
    <div>
      <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="p1" data-change="-1">-</button>
      <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="p1" data-change="1">+</button>
      <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="p1">삭제</button>
    </div>
  </div>`);
      });
    });

    describe('CartTotal', () => {
      it('할인이 없을 때 총액만 표시해야 한다', () => {
        const result = CartTotal({ total: 10000, discountRate: 0 });
        expect(result).toContain('총액: 10000원');
        expect(result).not.toContain('할인 적용');
      });

      it('할인이 적용될 때 총액과 할인율을 표시해야 한다', () => {
        const result = CartTotal({ total: 9000, discountRate: 0.1 });
        expect(result).toContain('총액: 9000원');
        expect(result).toContain('10.0% 할인 적용');
      });

      it('할인율이 소수점 둘째 자리에서 반올림되어야 한다', () => {
        const result = CartTotal({ total: 8750, discountRate: 0.125 });
        expect(result).toContain('12.5% 할인 적용');
      });

      it('할인율이 0%일 때 할인 정보를 표시하지 않아야 한다', () => {
        const result = CartTotal({ total: 10000, discountRate: 0 });
        expect(result).not.toContain('할인 적용');
      });

      it('총액이 0원일 때도 올바르게 표시되어야 한다', () => {
        const result = CartTotal({ total: 0, discountRate: 0 });
        expect(result).toContain('총액: 0원');
        expect(result).not.toContain('할인 적용');
      });
    });
  });

  describe('createShoppingCart >', () => {
    let cart;

    beforeEach(() => {
      cart = createShoppingCart();
    });

    it('장바구니에 상품을 추가할 수 있다.', () => {
      const product = { id: 'p1', name: '상품1', price: 10000 };
      cart.addItem(product);
      expect(cart.getItems()).toEqual([{ product, quantity: 1 }]);
    });

    it('이미 존재하는 상품을 추가할 때 수량이 증가해야 한다', () => {
      const product = { id: 'p1', name: '상품1', price: 10000 };
      cart.addItem(product);
      cart.addItem(product);
      expect(cart.getItems()).toEqual([{ product, quantity: 2 }]);
    });

    it('장바구니에서 상품을 제거할 수 있다.', () => {
      const product = { id: 'p1', name: '상품1', price: 10000 };
      cart.addItem(product);
      cart.removeItem('p1');
      expect(cart.getItems()).toHaveLength(0);
    });

    it('상품의 수량을 업데이트할 수 있다.', () => {
      const product = { id: 'p1', name: '상품1', price: 10000 };
      cart.addItem(product);
      cart.updateQuantity('p1', 3);
      expect(cart.getItems()[0].quantity).toBe(3);
    });

    it('수량이 0으로 업데이트될 때 해당 상품이 제거된다.', () => {
      const product = { id: 'p1', name: '상품1', price: 10000 };
      cart.addItem(product);
      cart.updateQuantity('p1', 0);
      expect(cart.getItems()).toHaveLength(0);
    });

    it('총액을 정확하게 계산해야 한다', () => {
      const product1 = { id: 'p1', name: '상품1', price: 10000 };
      const product2 = { id: 'p2', name: '상품2', price: 20000 };
      cart.addItem(product1);
      cart.addItem(product2, 2);
      expect(cart.getTotal().total).toBe(50000);
    });


    describe('할인 로직', () => {
      const products = [
        { id: 'p1', name: '상품1', price: 10000, discount: [[10, 0.1]] },
        { id: 'p2', name: '상품2', price: 20000, discount: [[10, 0.15]] },
        { id: 'p3', name: '상품3', price: 30000, discount: [[10, 0.2]] }
      ]

      describe('상품별 할인 적용', () => {
        it.each([
          { product: products[0], discount: products[0].discount[0][1]*100, expected: 90000 },// [0, 10, 90000],  // 상품1
          { product: products[1], discount: products[1].discount[0][1]*100, expected: 170000 },// [1, 10, 170000], // 상품2
          { product: products[2], discount: products[2].discount[0][1]*100, expected: 240000 },// [2, 10, 240000]  // 상품3
        ])('$product.name: 10개 이상 구매 시, $discount% 할인이 적용되어 $expected원이 된다.', ({ product, expected }) => {
          cart.addItem(product, 10);
          const { total } = cart.getTotal();
          expect(total).toBe(expected);
        });
      });

      it('30개 이상 구매 시 전체 25% 할인이 적용되어야 한다', () => {
        cart.addItem(products[0], 15);
        cart.addItem(products[1], 15);
        expect(cart.getTotal().total).toBe(337500); // (10000 * 15 + 20000 * 15) * 0.75
      });

      it('개별 상품 할인과 전체 할인 중 더 큰 할인이 적용되어야 한다', () => {
        cart.addItem(products[0], 15); // 10% 할인
        cart.addItem(products[2], 15); // 20% 할인
        // 전체 수량이 30개 이상이므로 25% 할인 적용
        expect(cart.getTotal().total).toBe(450000); // (10000 * 15 + 30000 * 15) * 0.75
      });

      it('할인율 정보가 올바르게 계산되어야 한다', () => {
        cart.addItem(products[0], 15); // 10% 할인
        cart.addItem(products[2], 15); // 20% 할인
        // 전체 수량이 30개 이상이므로 25% 할인 적용
        const { total, discountRate } = cart.getTotal();
        expect(total).toBe(450000);
        expect(discountRate).toBeCloseTo(0.25, 2); // 25% 할인
      });
    });
  });
})
