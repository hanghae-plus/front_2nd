//@ts-check
// #region 전역 변수
/**
 * 상품 목록
 *
 * @type {Array<{id: string, name: string, price: number, discount: number}>}
 */
const PRODUCT_LIST = [
  {
    id: "product-1",
    name: "상품1",
    price: 10000,
    discount: 0.1
  },
  {
    id: "product-2",
    name: "상품2",
    price: 20000,
    discount: 0.15
  },
  {
    id: "product-3",
    name: "상품3",
    price: 30000,
    discount: 0.2
  },
];

/**
 * 장바구니 목록
 *
 * @type {Array<{id: string, name: string, price: number, discount: number, quantity: number}>}
 */
let CART_LIST = [];
// #endregion

// #region function - logic
/**
 * 수량 업데이트 함수
 * @param {string} id
 * @param {'increase' | 'decrease'} operation
 */
const updateQuantity = (id, operation) => {
  const item = CART_LIST.find(cartItem => cartItem.id === id);

  if (!item) return;

  switch(operation) {
    case 'increase':
      item.quantity += 1;
      break;
    case 'decrease':
      item.quantity -= 1;
      if (item.quantity <= 0) {
        CART_LIST = CART_LIST.filter(cartItem => cartItem.id !== id);
      }
      break;
    default:
      return;
  }

  updateCartUI();
};

/**
 * 장바구니 상품 추가 함수
 * @param {{id: string, name: string, price: number, discount: number}} item 
 */
const addItem = (item) => {
  CART_LIST = [...CART_LIST, { ...item, quantity: 1 }];
  updateCartUI();
}

/**
 * 장바구니 상품 삭제 함수
 * @param {string} id 
 */
const removeItem = (id) => {
  CART_LIST = CART_LIST.filter(cartItem => cartItem.id !== id);
  updateCartUI();
}

/**
 * 가격 총합 및 할인율 계산 함수
 * @returns {{total: number, discountRate: number}}
 */
function calculateTotal() {
  let total = 0; // 총합
  let totalQuantity = 0; // 총 개수
  let originalTotal = 0; // 할인 전 총액

  CART_LIST.forEach(item => {
    const itemTotal = item.price * item.quantity;
    let discount = 0;
    
    totalQuantity += item.quantity;
    originalTotal += itemTotal;

    if (item.quantity >= 10) {
      discount = item.discount;
    }
    
    total += itemTotal * (1 - discount);
  });

  let discountRate = 0;

  if (totalQuantity >= 30) {
    const bulkDiscount = originalTotal * 0.25;
    const individualDiscount = originalTotal - total;
    if (bulkDiscount > individualDiscount) {
        total = originalTotal * 0.75;
        discountRate = 0.25;
    } else {
        discountRate = individualDiscount / originalTotal;
    }
  } else {
    discountRate = (originalTotal - total) / originalTotal;
  }

  return { total, discountRate };
}
// #endregion

// #region function - ui
/**
 * 장바구니 UI 업데이트 함수
 */
function updateCartUI() {
  const cartList = document.getElementById("cart-items");

  if (!cartList) return;

  cartList.innerHTML = '';

  CART_LIST.forEach(item => {
    //INFO: li 태그로 구현했으나, 테스트 코드 통과를 위해 div로 변경..
    const cartItem = `
        <div id="${item.id}" class="flex justify-between items-center mb-2">
            <span>${item.name} - ${item.price}원 x ${item.quantity}</span>
            <div>
                <button
                    class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
                    data-product-id="${item.id}"
                    data-change="-1"
                    data-action="decrease"
                >
                -
                </button>
                <button
                    class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
                    data-product-id="${item.id}"
                    data-change="1"
                    data-action="increase"
                >
                +
                </button>
                <button 
                    class="remove-item bg-red-500 text-white px-2 py-1 rounded" 
                    data-product-id="${item.id}"
                    data-action="remove"
                >
                삭제
                </button>
            </div>
        </div>
    `;
    
    cartList.innerHTML += cartItem;
  });

  updateTotalUI();
}

/**
 * 총합 UI 업데이트 함수
 */
function updateTotalUI() {
  const totalElement = document.getElementById("cart-total");

  if (!totalElement) return;

  const { total, discountRate } = calculateTotal();

  totalElement.textContent = '총액: ' + Math.round(total) + '원';

  if (discountRate > 0) {
    const discountSpan = document.createElement('span');
    discountSpan.className = 'text-green-500 ml-2';
    discountSpan.textContent = '(' + (discountRate * 100).toFixed(1) + '% 할인 적용)';
    totalElement.appendChild(discountSpan);
  }
}
// #endregion

// #region event handler
/**
 * 추가 버튼 클릭 이벤트 핸들러
 * @param {Event} event 
 */
const handleAddClick = (event) => {
  // TODO: 개선 방법 생각해보기..
  const selectElement = document.getElementById("product-select");

  if (!selectElement) return;

  // @ts-ignore
  const selectedId = selectElement.value;
  const selectedItem = PRODUCT_LIST.find(
    (product) => product.id === selectedId,
  );

  if (!selectedItem) return;

  const isInCart = CART_LIST.find(
    (cartItem) => cartItem.id === selectedItem.id,
  );

  if (isInCart) {
    updateQuantity(selectedItem.id, "increase");
  } else {
    addItem(selectedItem);
  }
}

/**
 * 장바구니 항목 클릭 이벤트 핸들러
 * @param {Event} event 
 */
const handleCartClick = (event) => {
  const target = event.target;
  
  if (!target) return;

  // @ts-ignore
  const action = target.dataset.action;
  // @ts-ignore
  const productId = target.dataset.productId

  switch(action) {
    case 'increase':
      updateQuantity(productId, "increase");
      break;
    case 'decrease':
      updateQuantity(productId, "decrease");
      break;
    case 'remove':
      removeItem(productId);
      break;
    default:
      return;
  }
}
// #endregion

function main() {
  // #region 기본 레이아웃 생성
  const app = document.getElementById("app");

  if (!app) return;

  // INFO: 장바구니 ul 태그로 구현했으나, 테스트 코드를 위해 div로 변경
  const component = `
    <div class="bg-gray-100 p-8">
      <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 class="text-2xl font-bold mb-4">장바구니</h1>
        <div id="cart-items"></div>
        <div id="cart-total" class="text-xl font-bold my-4"></div>
        <select id="product-select" class="border rounded p-2 mr-2">
          ${PRODUCT_LIST.map(
            (product) =>
              `<option value=${product.id}>${product.name} - ${product.price}원</option>`,
          )}
        </select>
        <button id="add-to-cart" class="bg-blue-500 text-white px-4 py-2 rounded">추가</button>
      </div>
    </div>
  `;

  app.innerHTML = component;
  // #endregion

  // #region 추가 버튼 이벤트 핸들러 등록
  const addToCartButton = document.getElementById("add-to-cart");

  if (addToCartButton) {
    addToCartButton.onclick = handleAddClick;
  }
  // #endregion

  // #region 장바구니 이벤트 핸들러 등록
  const cartList = document.getElementById('cart-items');

  if (cartList) {
    cartList.onclick = handleCartClick;
  }
  // #endregion
}

main();
