import { createCartView } from './createCartView.js';
import { createShoppingCart } from './createShoppingCart.js';
import products from './productData.js';

function main() {
  const render = createCartView(products);
  const cart = createShoppingCart();

  // 아이템 추가 버튼 이벤트
  const $addButton = document.getElementById('add-to-cart');
  $addButton.addEventListener('click', () => {
    const $productSelect = document.getElementById('product-select');
    const selectedId = $productSelect.value;
    const selectedItem = products.find((product) => product.id === selectedId);

    cart.addItem(selectedItem);
    render({
      cartList: cart.getItems(),
      total: cart.getTotal(),
    });
  });

  // 장바구니 수량 추가,감소 및 삭제 버튼 이벤트
  const $cartItems = document.getElementById('cart-items');
  $cartItems.addEventListener('click', (event) => {
    const target = event.target;
    const targetId = target.dataset.productId;

    if (!targetId) return;

    if (target.classList.contains('quantity-change')) {
      // 아이템 수량 추가, 감소
      const change = parseInt(target.dataset.change);
      const selectedProduct = products.find(
        (product) => product.id === targetId
      );

      cart.addItem(selectedProduct, change);
    } else if (target.classList.contains('remove-item')) {
      // 아이템 삭제
      cart.removeItem(targetId);
    }
    render({
      cartList: cart.getItems(),
      total: cart.getTotal(),
    });
  });
}

main();
