function createElement(type, properties = {}, text) {
  let $element;
  if (type) {
    $element = document.createElement(type);
  } else {
    $element = document.createTextNode();
  }

  for (const [attr, value] of Object.entries(properties)) {
    $element.setAttribute(attr, value);
  }

  if (text) {
    $element.textContent = text;
  }
  return $element;
}

function handleAddProductToCart(targetProductId, products, $cartItems) {
  const addProduct = products.find((product) => product.id === targetProductId);

  if (addProduct) {
    const $targetEl = document.getElementById(addProduct.id);
    if ($targetEl) {
      const quantity =
        parseInt($targetEl.querySelector('span').textContent.split('x ')[1]) +
        1;

      $targetEl.querySelector('span').textContent =
        addProduct.name + ' - ' + addProduct.price + '원 x ' + quantity;
    } else {
      const $cartWrapper = createElement('div', {
        id: addProduct.id,
        class: 'flex justify-between items-center mb-2',
      });

      const $productTextSpan = createElement(
        'span',
        {},
        `${addProduct.name} -  ${addProduct.price}원 x 1`
      );

      const $buttonWrapper = document.createElement('div');

      const $minusButton = createElement(
        'button',
        {
          class:
            'quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1',
        },
        '-'
      );
      const $plusButton = createElement(
        'button',
        {
          class:
            'quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1',
        },
        '+'
      );
      const $removeButton = createElement(
        'button',
        {
          class: 'remove-item bg-red-500 text-white px-2 py-1 rounded',
        },
        '삭제'
      );

      $minusButton.dataset.productId = addProduct.id;
      $minusButton.dataset.change = '-1';

      $plusButton.dataset.productId = addProduct.id;
      $plusButton.dataset.change = '1';

      $removeButton.dataset.productId = addProduct.id;

      $buttonWrapper.append($minusButton, $plusButton, $removeButton);
      $cartWrapper.append($productTextSpan, $buttonWrapper);
      $cartItems.appendChild($cartWrapper);
    }
    updateCartTotal($cartItems, products);
  }
}

function handleCartAction(event, $cartItems, products) {
  const target = event.target;
  if (
    target.classList.contains('quantity-change') ||
    target.classList.contains('remove-item')
  ) {
    const productId = target.dataset.productId;
    const $targetProduct = document.getElementById(productId);

    if (target.classList.contains('quantity-change')) {
      const change = parseInt(target.dataset.change);

      const $targetSpan = $targetProduct.querySelector('span');
      const [priceText, quantityText] = $targetSpan.textContent.split('x ');

      const quantity = parseInt(quantityText) + change;

      if (quantity > 0) {
        $targetSpan.textContent = `${priceText} x ${quantity}`;
      } else {
        $targetProduct.remove();
      }
    } else if (target.classList.contains('remove-item')) {
      $targetProduct.remove();
    }
    updateCartTotal($cartItems, products);
  }
}

function updateCartTotal($cartItems, products) {
  let totalPrice = 0;
  let totalQuantity = 0;
  let totalBeforeDiscount = 0;
  let discountRate = 0;
  const $totalPrice = document.getElementById('cart-total');

  for (const cartItem of $cartItems.children) {
    const productId = cartItem.id;
    const product = products.find((product) => product.id === productId);

    const quantity = parseInt(
      cartItem.querySelector('span').textContent.split('x ')[1]
    );
    const productPrice = product.price * quantity;

    discountRate = 0;
    totalQuantity += quantity;
    totalBeforeDiscount += productPrice;

    const DISCOUNT_THRESHOLD = 10;
    const DISCOUNT_RATES = {
      p1: 0.1,
      p2: 0.15,
      p3: 0.2,
    };

    if (quantity >= DISCOUNT_THRESHOLD) {
      discountRate = DISCOUNT_RATES[product.id] || 0;
    }
    totalPrice += productPrice * (1 - discountRate);
  }

  const BULK_DISCOUNT_THRESHOLD = 30;
  const BULK_DISCOUNT_RATE = 0.25;

  discountRate = 0;
  if (totalQuantity >= BULK_DISCOUNT_THRESHOLD) {
    const bulkDiscount = totalPrice * BULK_DISCOUNT_RATE;
    const individualDiscount = totalBeforeDiscount - totalPrice;

    if (bulkDiscount > individualDiscount) {
      totalPrice = totalBeforeDiscount * 0.75;
      discountRate = BULK_DISCOUNT_RATE;
    } else {
      discountRate = (totalBeforeDiscount - totalPrice) / totalBeforeDiscount;
    }
  } else {
    discountRate = (totalBeforeDiscount - totalPrice) / totalBeforeDiscount;
  }

  $totalPrice.textContent = '총액: ' + Math.round(totalPrice) + '원';
  if (discountRate > 0) {
    const discountSpan = createElement(
      'span',
      {
        className: 'text-green-500 ml-2',
      },
      `(${(discountRate * 100).toFixed(1)}% 할인 적용)`
    );
    $totalPrice.appendChild(discountSpan);
  }
}

function main() {
  const products = [
    { id: 'p1', name: '상품1', price: 10000 },
    { id: 'p2', name: '상품2', price: 20000 },
    { id: 'p3', name: '상품3', price: 30000 },
  ];

  const $app = document.getElementById('app');

  const $wrapper = createElement('div', { class: 'bg-gray-100 p-8' });

  const $box = createElement('div', {
    class:
      'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8',
  });

  const $title = createElement(
    'h1',
    { class: 'text-2xl font-bold mb-4' },
    '장바구니'
  );

  const $cartItems = createElement('div', { id: 'cart-items' });

  const $totalPrice = createElement('div', {
    id: 'cart-total',
    class: 'text-xl font-bold my-4',
  });

  const $productSelect = createElement('select', {
    id: 'product-select',
    class: 'border rounded p-2 mr-2',
  });

  const $addProductButton = createElement(
    'button',
    {
      id: 'add-to-cart',
      class: 'bg-blue-500 text-white px-4 py-2 rounded',
    },
    '추가'
  );

  products.forEach((product) =>
    $productSelect.appendChild(
      createElement(
        'option',
        { value: product.id },
        `${product.name} - ${product.price}원`
      )
    )
  );

  $box.append(
    $title,
    $cartItems,
    $totalPrice,
    $productSelect,
    $addProductButton
  );
  $wrapper.appendChild($box);
  $app.appendChild($wrapper);

  $addProductButton.onclick = () =>
    handleAddProductToCart($productSelect.value, products, $cartItems);

  $cartItems.onclick = (event) => handleCartAction(event, $cartItems, products);
}

main();
