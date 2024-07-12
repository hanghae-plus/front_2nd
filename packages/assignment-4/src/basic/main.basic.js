// --- 매직넘버 및 상수 ---
const MIN_TOTAL_FOR_DISCOUNT = 30;
const MIN_ITEM_FOR_DISCOUNT = 10;
const DISCOUNT_RATE = 0.25;

const PRODUCT_LIST = [
  { id: 'p1', name: '상품1', price: 10000 },
  { id: 'p2', name: '상품2', price: 20000 },
  { id: 'p3', name: '상품3', price: 30000 },
];

const DISCOUNT_RATE_BY_PROD_ID = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
};

const SIGN_FOR_BTN = {
  '-': '-1',
  '+': '1',
};

// --- 기능 함수(handler 제외) ---
function appendChildren(parent, children) {
  if (!Array.isArray(children)) {
    children = [children];
  }

  children.forEach((child) => {
    parent.appendChild(child);
  });
}

function splitPriceInfo(info) {
  return info.querySelector('span').textContent.split('x ');
}

function changeTextContent(target, text) {
  target.textContent = text;
}

function getSameProduct(id) {
  return PRODUCT_LIST.find((product) => product.id === id);
}

function updateComponent() {
  const $cartItems = document.querySelector('#cart-items');
  const $total = document.querySelector('#cart-total');

  let [totalPrice, totalQuantity, originPrice] = Array.from(
    $cartItems.children
  ).reduce(
    ([prevPrice, prevQuantity, prevOriginPrice], item) => {
      const product = getSameProduct(item.id);
      const quantity = parseInt(splitPriceInfo(item)[1]);
      const itemTotalPrice = product.price * quantity;

      let discountRate =
        (quantity >= MIN_ITEM_FOR_DISCOUNT &&
          DISCOUNT_RATE_BY_PROD_ID[product.id]) ||
        0;

      return [
        prevPrice + itemTotalPrice * (1 - discountRate),
        prevQuantity + quantity,
        prevOriginPrice + itemTotalPrice,
      ];
    },
    [0, 0, 0]
  );

  let totalDiscountRate = (originPrice - totalPrice) / originPrice;

  if (totalQuantity >= MIN_TOTAL_FOR_DISCOUNT) {
    const bulkDiscount = totalPrice * DISCOUNT_RATE;
    const individualDiscount = originPrice - totalPrice;

    if (bulkDiscount > individualDiscount) {
      totalPrice = originPrice * (1 - DISCOUNT_RATE);
      totalDiscountRate = DISCOUNT_RATE;
    }
  }

  changeTextContent($total, `총액: ${Math.round(totalPrice)}원`);

  if (totalDiscountRate > 0) {
    const discountInfo = createElement(
      `<span class="text-green-500 ml-2">(${(totalDiscountRate * 100).toFixed(
        1
      )}% 할인 적용)</span>`
    );

    appendChildren($total, discountInfo);
  }
}

// --- element 생성 함수 ---
const tmpComponent = document.createElement('div');

const createElement = (htmlString) => {
  tmpComponent.innerHTML = htmlString.trim();
  return tmpComponent.firstChild;
};

const createBaseUI = () => {
  const $app = document.getElementById('app');
  $app.innerHTML = `
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
  const $cartItems = $app.querySelector('#cart-items');
  const $select = $app.querySelector('#product-select');
  const $appendItemBtn = $app.querySelector('#add-to-cart');

  return { $cartItems, $select, $appendItemBtn };
};

const createCartItem = (product) => {
  const $itemContainer = createElement(
    `<div id="${product.id}" class="flex justify-between items-center mb-2"></div>`
  );

  const $priceInfo = createElement(
    `<span>${product.name} - ${product.price}원 x 1</span>`
  );

  const $buttonContainer = createElement('<div></div>');

  const $quantityChangeBtns = Object.entries(SIGN_FOR_BTN).map(([key, value]) =>
    createElement(
      `<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${product.id}" data-change="${value}">${key}</button>`
    )
  );

  const $removeButton = createElement(
    `<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${product.id}">삭제</button>`
  );

  appendChildren($buttonContainer, [...$quantityChangeBtns, $removeButton]);
  appendChildren($itemContainer, [$priceInfo, $buttonContainer]);

  return $itemContainer;
};

// --- event handler ---
function handleClickAddBtn() {
  const $select = document.querySelector('select');
  const $cartItems = document.querySelector('#cart-items');

  const product = getSameProduct($select.value);

  if (!product) return;

  const productItem = document.getElementById(product.id);

  if (productItem) {
    const quantity = parseInt(splitPriceInfo(productItem)[1]) + 1;

    changeTextContent(
      productItem.querySelector('span'),
      `${product.name} - ${product.price}원 x ${quantity}`
    );
  } else {
    appendChildren($cartItems, createCartItem(product));
  }
  updateComponent();
}

function hendleClickCartItems(event) {
  const target = event.target;

  const hasChangeClass = target.classList.contains('quantity-change');
  const hasRemoveClass = target.classList.contains('remove-item');

  if (!hasChangeClass && !hasRemoveClass) return;

  const productId = target.dataset.productId;
  const item = document.getElementById(productId);

  const change = parseInt(target.dataset.change);
  const quantity = parseInt(splitPriceInfo(item)[1]) + change;

  if ((hasChangeClass && quantity <= 0) || hasRemoveClass) {
    item.remove();
  } else {
    changeTextContent(
      item.querySelector('span'),
      `${splitPriceInfo(item)[0]}x ${quantity}`
    );
  }
  updateComponent();
}

// --- main ---
function main() {
  const { $cartItems, $select, $appendItemBtn } = createBaseUI();
  $cartItems.addEventListener('click', hendleClickCartItems);
  $appendItemBtn.addEventListener('click', handleClickAddBtn);

  const $options = PRODUCT_LIST.map((product) =>
    createElement(
      `<option value="${product.id}">${product.name} - ${product.price}원</option>`
    )
  );
  appendChildren($select, $options);
}

main();
