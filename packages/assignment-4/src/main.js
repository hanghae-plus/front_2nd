import { products } from './basic/entitis';
import {
  caculateDiscount,
  createNode,
  render,
  findProductByID,
  caculateOptimalTotalAndRate,
  renderCartItem,
} from './basic/utils';

/**
 * item추가 버튼 이벤트 핸들러
 * @param {cart update 함수} updateCart
 */
const addItemHandler = (updateCart) => {
  /**현재 select된 item의 id값 */
  const value = document.getElementById('product-select').value;

  /**상품 목록에서 선택한 id로 값을 찾는 과정 */
  const item = products.find((product) => product.id === value);

  const $cartItem = document.querySelector(`#${item.id}`);

  //선택한 상품이 이미 장바구니에 있다면??
  if ($cartItem) {
    const quantity =
      parseInt($cartItem.querySelector('span').textContent.split('x ')[1]) + 1;
    $cartItem.querySelector('span').textContent =
      item.name + ' - ' + item.price + '원 x ' + quantity;
  }
  //선택한 상품이 장바구니에 없다면??
  else {
    renderCartItem(item);
  }
  //금액 업데이트
  updateCart();
};

/** 수량 업데이트 이벤트 핸들러
 * @param1 eventTarget
 * @param2 updateCart 함수
 * */
const updateQuantityHandler = (target, updateCart) => {
  const productId = target.dataset.productId;

  /**장바구니에 있는 아이템 */
  const item = document.getElementById(productId);

  // +,- 버튼일 경우
  if (target.classList.contains('quantity-change')) {
    /**해당 버튼의 change dataset
     * -버튼의 경우 data property로 -1
     * +버튼의 경우 data property로 +1
     */
    const change = parseInt(target.dataset.change);

    // 해당 아이템 구조분해
    const [targetItemInform, currentQuantity] = item
      .querySelector('span')
      .textContent.split('x ');

    /**해당 아이템의 총 수량 */
    const quantity = Number(currentQuantity) + change;
    quantity > 0
      ? (item.querySelector(
          'span'
        ).textContent = `${targetItemInform}x ${quantity}`)
      : item.remove();
  }
  // 그외(삭제 버튼)의 경우
  if (target.classList.contains('remove-item')) {
    item.remove();
  }
  updateCart();
};

/**총액을 계산하는 함수 */
function updateCart() {
  const cart = document.querySelector('#cart-items');

  const items = Array.from(cart.children);

  const { total, totalQuantity, totalBeforeDiscount } = items.reduce(
    (acc, currentProduct) => {
      const product = findProductByID(currentProduct.id);

      const quantity = parseInt(
        currentProduct.querySelector('span').textContent.split('x ')[1]
      );

      const itemTotal = product.price * quantity;
      const discountRate = caculateDiscount(product.id, quantity);

      return {
        total: acc.total + itemTotal * (1 - discountRate),
        totalQuantity: acc.totalQuantity + quantity,
        totalBeforeDiscount: acc.totalBeforeDiscount + itemTotal,
      };
    },
    { total: 0, totalQuantity: 0, totalBeforeDiscount: 0 }
  );

  const { newDiscountRate, newTotal } = caculateOptimalTotalAndRate(
    totalQuantity,
    totalBeforeDiscount,
    total
  );

  const totalRounded = Math.round(newTotal);

  const $cartTotal = document.querySelector('#cart-total');
  $cartTotal.textContent = `총액: ${totalRounded}원`;

  if (newDiscountRate <= 0) {
    const discountPercentage = (newDiscountRate * 100).toFixed(1);

    const discountTemplate = `<span class='text-green-500 ml-2'>(${discountPercentage}% 할인 적용)</span>`;

    $cartTotal.appendChild(createNode(discountTemplate));
  }
}

function main() {
  /**app root**/
  const app = document.getElementById('app');

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

  render(app, createNode(mainTemplate));

  /**추가 버튼 */
  const addButton = document.querySelector('#add-to-cart');
  addButton.addEventListener('click', () => addItemHandler(updateCart));

  /**cartList 버튼group */
  const cartList = document.querySelector('#cart-items');
  cartList.addEventListener('click', ({ target }) =>
    updateQuantityHandler(target, updateCart)
  );
}

main();
