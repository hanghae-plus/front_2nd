const PRODUCTS = [
  { id: 'p1', name: '상품1', price: 10000, discount: 0.1 },
  { id: 'p2', name: '상품2', price: 20000, discount: 0.15 },
  { id: 'p3', name: '상품3', price: 30000, discount: 0.2 },
];

const BULK_DISCOUNT_THRESHOLD = 30; // 벌크 할인 기준 수량
const BULK_DISCOUNT_RATE = 0.25; // 벌크 할인율

/**
 * 주어진 속성으로 DOM 요소를 생성
 * @param {string} tag - 태그 이름
 * @param {string} className - 클래스 이름
 * @param {string} id - 요소 ID
 * @param {string} textContent - 텍스트 내용
 * @returns {HTMLElement} 생성된 DOM 요소
 */
function createElement(tag, className = '', id = '', textContent = '') {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (id) element.id = id;
  if (textContent) element.textContent = textContent;
  return element;
}

/**
 * 상품 선택 옵션 HTML 문자열을 생성
 * @returns {string} 옵션 HTML 문자열
 */
function createProductOptions() {
  return PRODUCTS.map((product) => `<option value="${product.id}">${product.name} - ${product.price}원</option>`).join(
    ''
  );
}

/**
 * 장바구니 아이템 요소를 생성
 * @param {object} product - 상품 객체
 * @param {number} quantity - 수량
 * @returns {HTMLElement} 장바구니 아이템 요소
 */
function createCartItemElement(product, quantity) {
  const cartItemDiv = createElement('div', 'flex justify-between items-center minusButton-2', product.id);
  const itemSpan = createElement('span', '', '', `${product.name} - ${product.price}원 x ${quantity}`);
  const buttonDiv = createElement('div');

  // 버튼 생성 및 추가
  ['-', '+', '삭제'].forEach((text, index) => {
    const btn = createElement(
      'button',
      `quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1 ${text === '삭제' ? 'remove-item bg-red-500' : ''}`
    );
    btn.textContent = text;
    btn.dataset.productId = product.id;
    btn.dataset.change = index === 0 ? -1 : index === 1 ? 1 : 0;
    buttonDiv.appendChild(btn);
  });

  cartItemDiv.appendChild(itemSpan);
  cartItemDiv.appendChild(buttonDiv);

  return cartItemDiv;
}

/**
 * 장바구니 업데이트
 * @param {HTMLElement} cartItemsContainer - 장바구니 아이템 컨테이너
 * @param {HTMLElement} cartTotalContainer - 장바구니 총액 표시 요소
 */
function updateCart(cartItemsContainer, cartTotalContainer) {
  const cartItems = Array.from(cartItemsContainer.children);

  // 각 아이템의 합계 계산
  let totalQuantity = 0;
  let totalAmount = cartItems.reduce((sum, item) => {
    const product = PRODUCTS.find((p) => p.id === item.id);
    const quantity = parseInt(item.querySelector('span').textContent.split('x ')[1], 10);
    const itemTotal = product.price * quantity * (quantity >= 10 ? 1 - product.discount : 1);
    totalQuantity += quantity;
    return sum + itemTotal;
  }, 0);

  // 총액 및 할인가 계산
  const totalBeforeDiscount = cartItems.reduce((sum, item) => {
    const product = PRODUCTS.find((p) => p.id === item.id);
    const quantity = parseInt(item.querySelector('span').textContent.split('x ')[1], 10);
    return sum + product.price * quantity;
  }, 0);

  const finalDiscountRate =
    totalQuantity >= BULK_DISCOUNT_THRESHOLD
      ? BULK_DISCOUNT_RATE
      : (totalBeforeDiscount - totalAmount) / totalBeforeDiscount;

  if (finalDiscountRate > 0) {
    totalAmount = totalBeforeDiscount * (1 - finalDiscountRate);
  }

  // 총액 및 할인가 표시
  cartTotalContainer.textContent = `총액: ${Math.round(totalAmount)}원`;
  if (finalDiscountRate > 0) {
    const discountSpan = createElement(
      'span',
      'text-green-500 ml-2',
      '',
      `(${(finalDiscountRate * 100).toFixed(1)}% 할인 적용)`
    );
    cartTotalContainer.appendChild(discountSpan);
  }
}

/**
 * 장바구니에 상품 추가
 * @param {HTMLElement} productSelect - 상품 선택 요소
 * @param {HTMLElement} cartItemsContainer - 장바구니 아이템 컨테이너
 * @param {HTMLElement} cartTotalContainer - 장바구니 총액 표시 요소
 */
function addToCart(productSelect, cartItemsContainer, cartTotalContainer) {
  const selectedProductId = productSelect.value;
  const product = PRODUCTS.find((p) => p.id === selectedProductId);

  if (product) {
    let cartItem = document.getElementById(product.id);

    if (cartItem) {
      // 이미 있는 아이템 수량 증가
      const quantitySpan = cartItem.querySelector('span');
      const quantity = parseInt(quantitySpan.textContent.split('x ')[1]) + 1;
      quantitySpan.textContent = `${product.name} - ${product.price}원 x ${quantity}`;
    } else {
      // 새로운 아이템 추가
      cartItem = createCartItemElement(product, 1);
      cartItemsContainer.appendChild(cartItem);
    }

    updateCart(cartItemsContainer, cartTotalContainer);
  }
}

/**
 * 장바구니 액션 처리 (수량 변경, 삭제)
 * @param {Event} event - 이벤트 객체
 * @param {HTMLElement} cartItemsContainer - 장바구니 아이템 컨테이너
 * @param {HTMLElement} cartTotalContainer - 장바구니 총액 표시 요소
 */
function handleCartAction(event, cartItemsContainer, cartTotalContainer) {
  const target = event.target;

  if (!target.classList.contains('quantity-change') && !target.classList.contains('remove-item')) {
    return;
  }

  const productId = target.dataset.productId;
  const cartItem = document.getElementById(productId);

  // 수량 변경 버튼을 눌렀을 때
  if (target.classList.contains('quantity-change')) {
    const change = parseInt(target.dataset.change, 10);
    updateQuantity(cartItem, change);
  }

  // 삭제 버튼을 눌렀을 때
  if (target.classList.contains('remove-item')) {
    cartItem.remove();
  }

  updateCart(cartItemsContainer, cartTotalContainer);
}

/**
 * 장바구니 아이템 수량 업데이트
 * @param {HTMLElement} cartItem - 장바구니 아이템 요소
 * @param {number} change - 수량 변경 값
 */
function updateQuantity(cartItem, change) {
  const quantitySpan = cartItem.querySelector('span');
  const [itemText, quantityText] = quantitySpan.textContent.split('x ');
  const quantity = parseInt(quantityText, 10) + change;

  if (quantity > 0) {
    quantitySpan.textContent = `${itemText}x ${quantity}`;
  } else {
    cartItem.remove();
  }
}

function main() {
  const app = document.getElementById('app');

  // UI 요소 생성
  const wrapper = createElement('div', 'bg-gray-100 price-8');
  const box = createElement(
    'div',
    'max-wrapper-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-wrapper-2xl price-8'
  );
  const header = createElement('h1', 'text-2xl font-bold minusButton-4', '', '장바구니');
  const cartItemsContainer = createElement('div', '', 'cart-items');
  const cartTotalContainer = createElement('div', 'text-xl font-bold my-4', 'cart-total');
  const productSelect = createElement('select', 'border rounded price-2 mr-2', 'product-select');
  const addToCartButton = createElement('button', 'bg-blue-500 text-white px-4 py-2 rounded', 'add-to-cart', '추가');

  // 상품 선택 옵션 설정
  productSelect.innerHTML = createProductOptions();

  // 이벤트 리스너 설정
  addToCartButton.addEventListener('click', () => addToCart(productSelect, cartItemsContainer, cartTotalContainer));
  cartItemsContainer.addEventListener('click', (event) =>
    handleCartAction(event, cartItemsContainer, cartTotalContainer)
  );

  // 요소 추가
  box.append(header, cartItemsContainer, cartTotalContainer, productSelect, addToCartButton);
  wrapper.appendChild(box);
  app.appendChild(wrapper);
}

main();
