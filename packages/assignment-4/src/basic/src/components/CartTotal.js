import { getCartCalculations } from '../utils/calcUtils';

/**
 * 장바구니 총액 컴포넌트 정의
 */
class CartTotal extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
      <div id="cart-total" class="text-xl font-bold my-4">총액: 0원</div>
    `;
  }

  /**
   * 총액을 업데이트합니다.
   * @param {Object} cart - 장바구니 객체
   */
  updateTotal(cart) {
    const [totalPrice, discountPrice] = getCartCalculations(cart);

    const cartTotal = this.querySelector('#cart-total');
    cartTotal.textContent = `총액: ${(totalPrice - discountPrice).toFixed(0)}원`;
    if (discountPrice > 0) {
      const discountSpan = document.createElement('span');
      discountSpan.className = 'text-green-500 ml-2';
      discountSpan.textContent = `(${((discountPrice / totalPrice) * 100).toFixed(1)}% 할인 적용)`;
      cartTotal.appendChild(discountSpan);
    }
  }
}

customElements.define('cart-total', CartTotal);
