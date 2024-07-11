import getElement from './utils/element';

const PRODUCTS = [
  { id: 'p1', name: '상품1', price: 10000 },
  { id: 'p2', name: '상품2', price: 20000 },
  { id: 'p3', name: '상품3', price: 30000 },
];

const DISCOUNT_RATES = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
};

const BULK_DISCOUNT_THRESHOLD = 30;
const BULK_DISCOUNT_RATE = 0.25;

const SELECTORS = {
  APP: '#app',
  CART_ITEMS: '#cart-items',
  CART_TOTAL: '#cart-total',
  PRODUCT_SELECT: '#product-select',
  ADD_TO_CART_BUTTON: '#add-to-cart',
};

function createCartHTML() {
  return `
    <div class="bg-gray-100 p-8">
      <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 class="text-2xl font-bold mb-4">장바구니</h1>
        <div id="cart-items"></div>
        <div id="cart-total" class="text-xl font-bold my-4"></div>
        <select id="product-select" class="border rounded p-2 mr-2"></select>
        <button id="add-to-cart" class="bg-blue-500 text-white px-4 py-2 rounded">추가</button>
      </div>
    </div>
  `;
}

function createCartItemHTML(product, quantity) {
  return `
    <div id="${product.id}" class="flex justify-between items-center mb-2">
      <span>${product.name} - ${product.price}원 x ${quantity}</span>
      <div>
        <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${product.id}" data-change="-1">-</button>
        <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${product.id}" data-change="1">+</button>
        <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${product.id}">삭제</button>
      </div>
    </div>
  `;
}

// 제품 옵션 생성 함수
function createProductOption(product) {
  return `<option value="${product.id}">${product.name} - ${product.price}원</option>`;
}

// 제품 선택 옵션 채우기 함수
function populateProductSelect(selectElement) {
  selectElement.innerHTML = PRODUCTS.map(createProductOption).join('');
}

function extractCartItemsData(cartItemElements) {
  return Array.from(cartItemElements).map((item) => {
    const product = PRODUCTS.find((p) => p.id === item.id);
    const quantity = parseInt(item.querySelector('span').textContent.split('x ')[1], 10);
    return {
      id: product.id,
      price: product.price,
      quantity,
    };
  });
}

// 개별 상품 할인 계산 함수
function calculateIndividualDiscount(item) {
  return item.quantity >= 10 ? DISCOUNT_RATES[item.id] || 0 : 0;
}

// 장바구니 계산 함수
function calculateCart(items) {
  let totalQuantity = 0;
  let totalBeforeDiscount = 0;
  let totalAfterDiscount = 0;

  items.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    totalQuantity += item.quantity;
    totalBeforeDiscount += itemTotal;

    const individualDiscount = calculateIndividualDiscount(item);
    totalAfterDiscount += itemTotal * (1 - individualDiscount);
  });

  // 대량 구매 할인 적용
  if (totalQuantity >= BULK_DISCOUNT_THRESHOLD) {
    const bulkDiscountTotal = totalBeforeDiscount * (1 - BULK_DISCOUNT_RATE);
    totalAfterDiscount = Math.min(totalAfterDiscount, bulkDiscountTotal);
  }

  const totalDiscount = (totalBeforeDiscount - totalAfterDiscount) / totalBeforeDiscount;

  return {
    finalTotal: Math.round(totalAfterDiscount),
    discountRate: totalDiscount,
  };
}

// DOM 업데이트 함수
function updateCartDisplay(cartTotal, { finalTotal, discountRate }) {
  cartTotal.textContent = `총액: ${finalTotal}원`;
  if (discountRate > 0) {
    const discountSpan = document.createElement('span');
    discountSpan.className = 'text-green-500 ml-2';
    discountSpan.textContent = `(${(discountRate * 100).toFixed(1)}% 할인 적용)`;
    cartTotal.appendChild(discountSpan);
  }
}

function initializeCart() {
  const app = getElement(SELECTORS.APP);
  app.innerHTML = createCartHTML();

  const elements = {
    productSelect: getElement(SELECTORS.PRODUCT_SELECT),
    addToCartButton: getElement(SELECTORS.ADD_TO_CART_BUTTON),
    cartItems: getElement(SELECTORS.CART_ITEMS),
    cartTotal: getElement(SELECTORS.CART_TOTAL),
  };

  populateProductSelect(elements.productSelect);

  function updateCart() {
    const cartItemsData = extractCartItemsData(elements.cartItems.children);
    const cartResult = calculateCart(cartItemsData);
    updateCartDisplay(elements.cartTotal, cartResult);
  }

  function addToCart() {
    const { value } = elements.productSelect;

    const selectedProduct = PRODUCTS.find((product) => product.id === value);

    if (!selectedProduct) {
      return;
    }

    const existingItem = document.getElementById(selectedProduct.id);

    if (existingItem) {
      const quantitySpan = existingItem.querySelector('span');
      const quantity = parseInt(quantitySpan.textContent.split('x ')[1], 10) + 1;
      quantitySpan.textContent = `${selectedProduct.name} - ${selectedProduct.price}원 x ${quantity}`;
    } else {
      const cartItemHTML = createCartItemHTML(selectedProduct, 1);
      elements.cartItems.insertAdjacentHTML('beforeend', cartItemHTML);
    }

    updateCart();
  }

  function handleClickCartItems(event) {
    const target = event.target;
    if (target.classList.contains('quantity-change') || target.classList.contains('remove-item')) {
      const productId = target.dataset.productId;
      const item = document.getElementById(productId);
      if (target.classList.contains('quantity-change')) {
        const change = parseInt(target.dataset.change);
        const quantity = parseInt(item.querySelector('span').textContent.split('x ')[1]) + change;
        if (quantity > 0) {
          item.querySelector('span').textContent =
            item.querySelector('span').textContent.split('x ')[0] + 'x ' + quantity;
        } else {
          item.remove();
        }
      } else if (target.classList.contains('remove-item')) {
        item.remove();
      }
      updateCart();
    }
  }

  elements.addToCartButton.addEventListener('click', addToCart);
  elements.cartItems.addEventListener('click', handleClickCartItems);
}

function main() {
  try {
    initializeCart();
  } catch (error) {
    console.error(error);
  }
}

main();
