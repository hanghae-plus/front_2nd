const PRODUCTS = [
  { id: 'p1', name: '상품1', price: 10000 },
  { id: 'p2', name: '상품2', price: 20000 },
  { id: 'p3', name: '상품3', price: 30000 },
];

// 속성 부여 함수
const setAttributes = (target, attributes) => {
  for (const [key, value] of Object.entries(attributes)) {
    if (key === 'dataset') {
      for (const [dataKey, dataValue] of Object.entries(value)) {
        target.dataset[dataKey] = dataValue;
      }
    } else {
      target[key] = value;
    }
  }
};

// 레이아웃 구성
const createLayout = (tagName, attributes = {}) => {
  const $layout = document.createElement(tagName);
  setAttributes($layout, attributes);
  return $layout;
};

// PRODUCUS에 대한 option값 생성
const addProductOption = target => {
  PRODUCTS.map(product => {
    const $option = createLayout('option', {
      value: product.id,
      textContent: `${product.name} - ${product.price}원`,
    });
    target.appendChild($option);
  });
};

const appendChildElements = (target, ...childElement) => {
  return target.append(...childElement);
};

const generateInitElement = () => {
  const $app = document.getElementById('app');

  const $wrapper = createLayout('div', { className: 'bg-gray-100 p-8' });
  const $container = createLayout('div', {
    className:
      'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8',
  });

  const $header = createLayout('h1', {
    className: 'text-2xl font-bold mb-4',
    textContent: '장바구니',
  });

  const $cartProducts = createLayout('div', { id: 'cart-items' });
  const $totalProduct = createLayout('div', {
    id: 'cart-total',
    className: 'text-xl font-bold my-4',
  });

  const $productSelect = createLayout('select', {
    id: 'product-select',
    className: 'border rounded p-2 mr-2',
  });
  addProductOption($productSelect);

  const $addButton = createLayout('button', {
    id: 'add-to-cart',
    className: 'bg-blue-500 text-white px-4 py-2 rounded',
    textContent: '추가',
    onclick: onClickAddButton,
  });

  appendChildElements(
    $container,
    $header,
    $cartProducts,
    $totalProduct,
    $productSelect,
    $addButton,
  );
  appendChildElements($wrapper, $container);
  appendChildElements($app, $wrapper);
};

const getCartProductInfos = () => {
  let total = 0;
  let totalPrice = 0;
  let totalQuantity = 0;

  let discount = 0;

  const $cartItem = document.getElementById('cart-items');
  const $cartItemChildren = $cartItem.children ?? [];

  $cartItemChildren.forEach(children => {
    const productId = children.id;

    const $productInfo = children.querySelector('span');
    const { price, count } = getTargetProductInfo($productInfo);

    totalPrice += price;
    totalQuantity += count;

    discount = count >= 10 ? getDiscount[productId] : 0;
    total += totalQuantity * (1 - discount);
  });

  return { total, totalQuantity, totalPrice };
};

const getDisCountRate = (total, totalQuantity, totalPrice) => {
  let discountRate = 0;

  if (totalQuantity >= 30) {
    const bulkDiscount = total * 0.25; // 총액의 25% 추가 할인
    const individualDiscount = totalPrice - total;
    // 더 큰 할인율 적용
    if (bulkDiscount > individualDiscount) {
      total = totalPrice * 0.75;
      discountRate = 0.25;
    } else {
      discountRate = (totalPrice - total) / totalPrice;
    }
  } else {
    discountRate = (totalPrice - total) / totalPrice;
  }

  return discountRate;
};

const updateCart = () => {
  const { total, totalQuantity, totalPrice } = getCartProductInfos();
  getDisCountRate(total, totalQuantity, totalPrice);
};

const onClickAddButton = () => {
  const $productSelect = document.getElementById('product-select');
  const selectedProduct = PRODUCTS.find(
    product => product.id === $productSelect.value,
  );

  if (!selectedProduct) return;

  const $product = document.getElementById(selectedProduct.id);

  if ($product) {
    const target = $product.querySelector('button[data-change="1"]');
    onClickCountChangeButton({ target });
    return;
  }

  const $cartProducts = document.getElementById('cart-items');

  const $cartProduct = createLayout('div', {
    className: 'flex justify-between items-center mb-2',
    id: selectedProduct.id,
  });

  const $productInfo = createLayout('span', {
    textContent: `${selectedProduct.name} - ${selectedProduct.price}원 x ${1}`,
  });

  const $buttonWrapper = createLayout('div');
  const $minusButton = createLayout('button', {
    className: 'quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1',
    textContent: '-',
    dataset: {
      productId: selectedProduct.id,
      change: '-1',
    },
    onclick: getButtonClickEvent['-'],
  });
  const $plusButton = createLayout('button', {
    className: 'quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1',
    textContent: '+',
    dataset: {
      productId: selectedProduct.id,
      change: '1',
    },
    onclick: getButtonClickEvent['+'],
  });
  const $removeButton = createLayout('button', {
    className: 'remove-item bg-red-500 text-white px-2 py-1 rounded',
    textContent: '삭제',
    dataset: {
      productId: selectedProduct.id,
    },
    onclick: getButtonClickEvent['삭제'],
  });

  appendChildElements($buttonWrapper, $minusButton, $plusButton, $removeButton);
  appendChildElements($cartProduct, $productInfo, $buttonWrapper);
  appendChildElements($cartProducts, $cartProduct);
};

// +/- 버튼 클릭 이벤트
const onClickCountChangeButton = ({ target }) => {
  const productId = target.dataset.productId;
  const change = target.dataset.change;
  const $productInfo = document.querySelector(`[id=${productId}] > span`);

  const { name, price, count } = getTargetProductInfo($productInfo);

  if (count === 1 && change === '-1')
    return onClickProductRemoveButton({ target });

  $productInfo.textContent = `${name} - ${price}원 x ${count + parseInt(change)}`;
};

// 제거 버튼 클릭 이벤트
const onClickProductRemoveButton = ({ target }) => {
  const productId = target.dataset.productId;
  const $product = document.getElementById(productId);

  $product.remove();
};

// 버튼 이벤트 객체
const getButtonClickEvent = {
  '+': onClickCountChangeButton,
  '-': onClickCountChangeButton,
  ['삭제']: onClickProductRemoveButton,
};

const getTargetProductInfo = $productInfo => {
  const productInfo = $productInfo.innerText.match(/(.+?) - (\d+)원 x (\d+)/);

  const name = productInfo[1];
  const price = parseInt(productInfo[2]);
  const count = parseInt(productInfo[3]);

  return { name, price, count };
};

const getDiscount = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
};

function main() {
  generateInitElement();
}

main();
