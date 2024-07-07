import { beforeAll, describe, expect, it, vi } from "vitest";

describe('basic test', () => {

  describe.each([
    { type: 'origin', loadFile: () => import('../../main.js'), },
    { type: 'basic', loadFile: () => import('../main.basic.js'), },
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
})
