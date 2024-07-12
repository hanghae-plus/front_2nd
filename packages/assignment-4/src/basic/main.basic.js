import { products } from './entitis';
import { renderCartItem, updateCart } from './utils';

/**
 * item추가 버튼 이벤트 핸들러
 * @param {cart update 함수} updateCart
 */
const addItemHandler = (updateCart) => {
  const value = document.getElementById('product-select').value;

  const item = products.find((product) => product.id === value);

  const $cartItem = document.querySelector(`#${item.id}`);

  if ($cartItem) {
    const quantity =
      parseInt($cartItem.querySelector('span').textContent.split('x ')[1]) + 1;
    $cartItem.querySelector('span').textContent =
      item.name + ' - ' + item.price + '원 x ' + quantity;
  } else {
    renderCartItem(item);
  }
  updateCart();
};

/** 수량 업데이트 이벤트 핸들러
 * @param1 eventTarget
 * @param2 updateCart 함수
 * */
const updateQuantityHandler = (target, updateCart) => {
  const productId = target.dataset.productId;

  const item = document.getElementById(productId);

  if (target.classList.contains('quantity-change')) {
    // +1 Or -1
    const change = parseInt(target.dataset.change);

    const [targetItemInform, currentQuantity] = item
      .querySelector('span')
      .textContent.split('x ');

    const quantity = Number(currentQuantity) + change;
    quantity > 0
      ? (item.querySelector(
          'span'
        ).textContent = `${targetItemInform}x ${quantity}`)
      : item.remove();
  }
  if (target.classList.contains('remove-item')) {
    item.remove();
  }
  updateCart();
};

function main() {
  /**app root**/
  const $app = document.getElementById('app');

  const options = products.map((product) => {
    const textContent = `${product.name}-${product.price}원`;
    const option = `<option value=${product.id}>${textContent}</option>`;
    return option;
  });

  const mainTemplate = `
   <div class="bg-gray-100 p-8">
      <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 class="text-2xl font-bold mb-4">장바구니</h1>
        <div id="cart-items"></div>
        <div id="cart-total" class="text-xl font-bold my-4"></div>
        <select id="product-select" class="border rounded p-2 mr-2">
          ${options.join('')}
        </select>
        <button id="add-to-cart" class="bg-blue-500 text-white px-4 py-2 rounded">추가</button>
      </div>
    </div>
    `;

  $app.innerHTML = mainTemplate;

  /**추가 버튼 */
  const $addButton = document.querySelector('#add-to-cart');
  $addButton.addEventListener('click', () => addItemHandler(updateCart));

  /**cartItem 버튼group */
  const $cartItems = document.querySelector('#cart-items');
  $cartItems.addEventListener('click', ({ target }) =>
    updateQuantityHandler(target, updateCart)
  );
}

main();
