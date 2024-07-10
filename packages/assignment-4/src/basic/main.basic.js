// 상품 목록
const PRODUCTS = [
  { id: 'p1', name: '상품1', price: 10000 },
  { id: 'p2', name: '상품2', price: 20000 },
  { id: 'p3', name: '상품3', price: 30000 },
];

const DISCOUNT_CONFIG = {
  DISCOUNT_BY_PRODUCT_ID: {
    p1: 0.1,
    p2: 0.15,
    p3: 0.2,
  },
  MINIMUM_COUNT: {
    PER_PRODUCT: 10,
    TOTAL_PRODUCT: 30,
  },
  TOTAL_DISCOUNT_RATE: 0.25,
};

const INITIAL_COUNT = 1;

///////////////////////////////////////////////////////////////////////////////////

// 속성 부여 함수
const setAttributes = (target, attributes) => {
  for (const [key, attribute] of Object.entries(attributes)) {
    if (typeof attribute === 'object') {
      setAttributes(target[key], attribute);
    } else {
      target[key] = attribute;
    }
  }
};

// 자식요소 append
const appendChildElements = (target, ...$child) => {
  return target.append(...$child.flat());
};

// 레이아웃 구성
const createLayout = (tagName, attributes = {}, $parent) => {
  const $layout = document.createElement(tagName);
  setAttributes($layout, attributes);
  appendChildElements($parent, $layout);
  return $layout;
};

////////////////////////////////////////////////////////////////////////
const getProductInfo = productId => {
  const $productInfo = document.getElementById(productId);
  const [_, name, price, count] = $productInfo.textContent.match(
    /(.+?) - (\d+)원 x (\d+)/,
  );

  return { name, price: parseInt(price), count: parseInt(count) };
};

// 수량이 10개 이상인 경우 제품당 할인 적용
const getDiscountedPricePerProduct = (productId, productInfo) => {
  const { price, count } = productInfo;

  const discountRate =
    count >= DISCOUNT_CONFIG.MINIMUM_COUNT.PER_PRODUCT
      ? DISCOUNT_CONFIG.DISCOUNT_BY_PRODUCT_ID[productId]
      : 0; // 상품당 할인율
  return price * count * (1 - discountRate);
};

// 예/아니오로 나온다 >> is , has , can
// 할인 적용 여부 - 총 수량이 30개 이상인 경우 + 조건에 해당하는지 여부 ..
const canApplyTotalDiscount = totalDiscountedPrice => {
  const { totalPrice, totalCount } = getProductTotalInfo();
  return (
    totalCount >= DISCOUNT_CONFIG.MINIMUM_COUNT.TOTAL_PRODUCT &&
    totalDiscountedPrice * DISCOUNT_CONFIG.TOTAL_DISCOUNT_RATE >
      totalPrice - totalDiscountedPrice
  );
};

const getTotalDiscountedPrice = () => {
  const $products = document.getElementById('cart-items');
  const $productsChildren = $products.childNodes ?? [];

  return Array.from($productsChildren).reduce((total, $product) => {
    const productId = $product.id;

    const $productInfo = $product.querySelector('span');
    const productInfo = getProductInfo($productInfo);

    return total + getDiscountedPricePerProduct(productId, productInfo);
  }, 0);
};

const getDiscountRateAndPrice = () => {
  const { totalPrice } = getProductTotalInfo();
  const totalDiscountedPrice = getTotalDiscountedPrice();

  const canApplyDiscount = canApplyTotalDiscount(totalDiscountedPrice);

  const discountedPrice = canApplyDiscount
    ? totalPrice * (1 - DISCOUNT_CONFIG.TOTAL_DISCOUNT_RATE)
    : totalDiscountedPrice;

  const discountRate = canApplyDiscount
    ? DISCOUNT_CONFIG.TOTAL_DISCOUNT_RATE
    : (totalPrice - totalDiscountedPrice) / totalPrice;

  return { discountedPrice, discountRate };
};

// 최종 가격 계산
const getProductTotalInfo = () => {
  const $products = document.getElementById('cart-items');
  const $productInfos = $products.querySelectorAll('span');

  let totalPrice = 0;
  let totalCount = 0;

  $productInfos.forEach($productInfo => {
    const { price, count } = getProductInfo($productInfo);

    totalPrice += price * count;
    totalCount += count;
  });

  return { totalPrice, totalCount };
};

const updateTotalProducts = () => {
  const $totalProduct = document.getElementById('cart-total');

  const { discountedPrice, discountRate } = getDiscountRateAndPrice();

  setAttributes($totalProduct, {
    textContent: `총액: ${Math.round(discountedPrice)}원`,
  });

  discountRate > 0 && buildTotalProductPrice(discountRate);
};

const getSelectedProduct = () => {
  const $productSelect = document.getElementById('product-select');
  return PRODUCTS.find(product => product.id === $productSelect.value);
};

// [추가] 버튼 클릭시 동작
const onClickAddButton = () => {
  const selectedProduct = getSelectedProduct();
  const $product = document.getElementById(selectedProduct.id);

  // 선택된 상품이 장바구니에 존재한다면 해당상품 +1
  if ($product) {
    const $plusButton = $product.querySelector('button[data-change="1"]');
    onClickCountChangeButton({ target: $plusButton });
    updateTotalProducts();
    return;
  }

  buildSelectedProduct(selectedProduct);
  updateTotalProducts();
};

// +/- 버튼 클릭 이벤트
const onClickCountChangeButton = ({ target }) => {
  const { productId, change } = target.dataset;
  const $productInfo = document.querySelector(`[id=${productId}] > span`);

  const { name, price, count } = getProductInfo($productInfo);

  if (count === 1 && change === '-1') {
    return onClickProductRemoveButton({ target });
  }

  setAttributes($productInfo, {
    textContent: `${name} - ${price}원 x ${count + parseInt(change)}`,
  });

  updateTotalProducts();
};

// 제거 버튼 클릭 이벤트
const onClickProductRemoveButton = ({ target }) => {
  const productId = target.dataset.productId;
  const $product = document.getElementById(productId);

  $product.remove();
  updateTotalProducts();
};

// 버튼 이벤트 객체
const getButtonClickEvent = {
  '+': onClickCountChangeButton,
  '-': onClickCountChangeButton,
  ['삭제']: onClickProductRemoveButton,
};

const buildTotalProductPrice = discountRate => {
  const $totalProduct = document.getElementById('cart-total');
  createLayout(
    'span',
    {
      className: 'text-green-500 ml-2',
      textContent: `(${(discountRate * 100).toFixed(1)}% 할인 적용)`,
    },
    $totalProduct,
  );
};

// PRODUCTS에 대한 option값 생성
const createProductOption = () => {
  const $productSelect = document.getElementById('product-select');

  PRODUCTS.map(product => {
    createLayout(
      'option',
      {
        value: product.id,
        textContent: `${product.name} - ${product.price}원`,
      },
      $productSelect,
    );
  });
};

// 선택된 상품 render
const buildSelectedProduct = selectedProduct => {
  const $cartProducts = document.getElementById('cart-items');

  const $cartProduct = createLayout(
    'div',
    {
      className: 'flex justify-between items-center mb-2',
      id: selectedProduct.id,
    },
    $cartProducts,
  );

  createLayout(
    'span',
    {
      textContent: `${selectedProduct.name} - ${selectedProduct.price}원 x ${INITIAL_COUNT}`,
    },
    $cartProduct,
  );

  const $buttonWrapper = createLayout('div', {}, $cartProduct);

  createLayout(
    'button',
    {
      className:
        'quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1',
      textContent: '-',
      dataset: {
        productId: selectedProduct.id,
        change: '-1',
      },
      onclick: getButtonClickEvent['-'],
    },
    $buttonWrapper,
  );

  createLayout(
    'button',
    {
      className:
        'quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1',
      textContent: '+',
      dataset: {
        productId: selectedProduct.id,
        change: '1',
      },
      onclick: getButtonClickEvent['+'],
    },
    $buttonWrapper,
  );

  createLayout(
    'button',
    {
      className: 'remove-item bg-red-500 text-white px-2 py-1 rounded',
      textContent: '삭제',
      dataset: {
        productId: selectedProduct.id,
      },
      onclick: getButtonClickEvent['삭제'],
    },
    $buttonWrapper,
  );
};

// 초기 장바구니 render
const buildCart = () => {
  const $app = document.getElementById('app');

  const $wrapper = createLayout('div', { className: 'bg-gray-100 p-8' }, $app);
  const $container = createLayout(
    'div',
    {
      className:
        'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8',
    },
    $wrapper,
  );

  createLayout(
    'h1',
    {
      className: 'text-2xl font-bold mb-4',
      textContent: '장바구니',
    },
    $container,
  );

  createLayout('div', { id: 'cart-items' }, $container);

  createLayout(
    'div',
    {
      id: 'cart-total',
      className: 'text-xl font-bold my-4',
    },
    $container,
  );

  createLayout(
    'select',
    {
      id: 'product-select',
      className: 'border rounded p-2 mr-2',
    },
    $container,
  );
  createProductOption();

  createLayout(
    'button',
    {
      id: 'add-to-cart',
      className: 'bg-blue-500 text-white px-4 py-2 rounded',
      textContent: '추가',
      onclick: onClickAddButton,
    },
    $container,
  );
};

function main() {
  buildCart();
}

main();
