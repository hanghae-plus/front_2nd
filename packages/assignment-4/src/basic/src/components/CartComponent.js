import './ProductSelect.js';
import './CartItems.js';
import './CartTotal.js';

/**
 * 장바구니 컴포넌트 정의
 */
class CartComponent extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
        <div class="bg-gray-100 p-8">
          <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
            <h1 class="text-2xl font-bold mb-4">장바구니</h1>
            <cart-items id="cart-items"></cart-items>
            <cart-total id="cart-total"></cart-total>
            <product-select id="product-select"></product-select>
            <button id="add-to-cart" class="bg-blue-500 text-white px-4 py-2 rounded">추가</button>
          </div>
    `;

    this.cart = {};
    this.productSelect = this.querySelector('#product-select');
    this.addToCartButton = this.querySelector('#add-to-cart');
    this.cartItems = this.querySelector('#cart-items');
    this.cartTotal = this.querySelector('#cart-total');

    // 초기 선택된 제품 ID를 설정합니다.
    this.selectedProductId = this.productSelect.querySelector('option').value;

    this.productSelect.addEventListener('product-selected', event => {
      this.selectedProductId = event.detail;
    });

    this.addToCartButton.addEventListener('click', () => this.addToCart());
    this.cartItems.addEventListener('click', e => this.handleCartActions(e));
  }

  /**
   * 선택된 제품을 장바구니에 추가합니다.
   */
  addToCart() {
    const selectedProductId = this.selectedProductId;
    if (!selectedProductId) {
      console.error('No product selected');
      return;
    }

    const selectedProductOption = this.productSelect.querySelector(`option[value="${selectedProductId}"]`);
    if (!selectedProductOption) {
      console.error('Selected product option not found');
      return;
    }

    const selectedProduct = selectedProductOption.textContent;
    const [name, price] = selectedProduct.split(' - ');
    const productPrice = parseInt(price.replace('원', ''));

    if (!this.cart[selectedProductId]) {
      this.cart[selectedProductId] = { id: selectedProductId, name, price: productPrice, quantity: 0 };
    }
    this.cart[selectedProductId].quantity++;
    this.updateCart();
  }

  /**
   * 장바구니 항목의 변경을 처리합니다.
   * @param {Event} event - 이벤트 객체
   */
  handleCartActions(event) {
    const target = event.target;
    const productId = target.dataset.productId;
    if (productId) {
      if (target.classList.contains('quantity-change')) {
        const change = parseInt(target.dataset.change);
        this.cart[productId].quantity += change;
        if (this.cart[productId].quantity <= 0) {
          delete this.cart[productId];
        }
      } else if (target.classList.contains('remove-item')) {
        delete this.cart[productId];
      }
      this.updateCart();
    }
  }

  /**
   * 장바구니를 업데이트합니다.
   */
  updateCart() {
    this.cartItems.setCart(this.cart);
    this.cartTotal.updateTotal(this.cart);
  }
}

customElements.define('cart-component', CartComponent);
