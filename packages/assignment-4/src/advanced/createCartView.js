import { MainLayout, CartItem, CartTotal } from './templates.js';
import { createShoppingCart } from './createShoppingCart.js';

export function createCartView(containerId, products) {
  const container = document.getElementById(containerId);
  container.innerHTML = MainLayout({ items: products });

  const cart = createShoppingCart();

  const select = document.getElementById('product-select');
  const addButton = document.getElementById('add-to-cart');

  addButton.addEventListener('click', () => {
    const product = products.find(p => p.id === select.value);
    if (product) {
      cart.addItem(product);
      renderCart();
    }
  });

  function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = cart.getItems().map(CartItem).join('');

    const cartTotal = document.getElementById('cart-total');
    const { total, discountRate } = cart.getTotal();
    cartTotal.innerHTML = CartTotal({ total, discountRate });

    // 수량 변경 이벤트 핸들러
    document.querySelectorAll('.quantity-change').forEach(button => {
      button.addEventListener('click', () => {
        const productId = button.getAttribute('data-product-id');
        const change = parseInt(button.getAttribute('data-change'));
        const item = cart.getItems().find(i => i.product.id === productId);
        if (item) {
          cart.updateQuantity(productId, item.quantity + change);
          renderCart();
        }
      });
    });

    // 상품 삭제 이벤트 핸들러
    document.querySelectorAll('.remove-item').forEach(button => {
      button.addEventListener('click', () => {
        const productId = button.getAttribute('data-product-id');
        cart.removeItem(productId);
        renderCart();
      });
    });
  }

  renderCart();
}
