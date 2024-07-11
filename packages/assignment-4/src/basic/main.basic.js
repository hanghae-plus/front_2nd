import getElement from './utils/element';

const PRODUCTS = [
  { id: 'p1', name: '상품1', price: 10000 },
  { id: 'p2', name: '상품2', price: 20000 },
  { id: 'p3', name: '상품3', price: 30000 },
];

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

  function uc() {
    let t = 0;
    let tq = 0;
    const items = elements.cartItems.children;
    let tb = 0;

    for (let m = 0; m < items.length; m += 1) {
      let item;
      for (let n = 0; n < PRODUCTS.length; n += 1) {
        if (PRODUCTS[n].id === items[m].id) {
          item = PRODUCTS[n];
          break;
        }
      }
      const quantity = parseInt(items[m].querySelector('span').textContent.split('x ')[1]);
      const itemTotal = item.price * quantity;
      let disc = 0;

      tq += quantity;
      tb += itemTotal;
      if (quantity >= 10) {
        if (item.id === 'p1') disc = 0.1;
        else if (item.id === 'p2') disc = 0.15;
        else if (item.id === 'p3') disc = 0.2;
      }
      t += itemTotal * (1 - disc);
    }

    let dr = 0;
    if (tq >= 30) {
      const bulkDiscount = t * 0.25;
      const individualDiscount = tb - t;
      if (bulkDiscount > individualDiscount) {
        t = tb * 0.75;
        dr = 0.25;
      } else {
        dr = (tb - t) / tb;
      }
    } else {
      dr = (tb - t) / tb;
    }

    elements.cartTotal.textContent = '총액: ' + Math.round(t) + '원';
    if (dr > 0) {
      const dspan = document.createElement('span');
      dspan.className = 'text-green-500 ml-2';
      dspan.textContent = '(' + (dr * 100).toFixed(1) + '% 할인 적용)';
      elements.cartTotal.appendChild(dspan);
    }
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
    uc();
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
      uc();
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
