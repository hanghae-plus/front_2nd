/**
 * 장바구니 항목 컴포넌트 정의
 */
class CartItems extends HTMLElement {
  constructor() {
    super();
    this.cart = {};
  }

  connectedCallback() {
    // 초기화할 내용이 있다면 여기서 설정합니다.
    this.render();
  }

  /**
   * 장바구니 항목을 설정합니다.
   * @param {Object} cart - 장바구니 객체
   */
  setCart(cart) {
    this.cart = cart;
    this.render();
  }

  /**
   * 장바구니 항목을 렌더링합니다.
   */
  render() {
    this.innerHTML = ''; // 기존 내용을 모두 제거합니다.
    Object.values(this.cart).forEach(item => {
      const cartItemDiv = document.createElement('div');
      cartItemDiv.id = item.id;
      cartItemDiv.className = 'flex justify-between items-center mb-2';
      cartItemDiv.innerHTML = `
        <span>${item.name} - ${item.price}원 x ${item.quantity}</span>
        <div>
          <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-change="1" data-product-id="${item.id}">+</button>
          <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-change="-1" data-product-id="${item.id}">-</button>
          <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${item.id}">삭제</button>
        </div>
      `;
      this.appendChild(cartItemDiv);
    });
  }
}

customElements.define('cart-items', CartItems);
