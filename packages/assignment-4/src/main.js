const products = [
  { id: 'p1', name: '상품1', price: 10000 },
  { id: 'p2', name: '상품2', price: 20000 },
  { id: 'p3', name: '상품3', price: 30000 },
];

const discountRates = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
};

const BULK_QUANTITY_THRESHOLD = 30;
const BULK_DISCOUNT_RATE = 0.25;
const MINIMUM_QUANTITY_FOR_DISCOUNT = 10;

function createTemplate(tag, className, textContent = '', attributes = {}) {
  const element = document.createElement(tag);
  element.className = className;
  element.textContent = textContent;

  Object.keys(attributes).forEach((key) => {
    element.setAttribute(key, attributes[key]);
  });
  return element;
}

function main() {
  const app = document.getElementById('app');
  const wrapper = createTemplate('div', 'bg-gray-100 p-8');
  const box = createTemplate(
    'div',
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8'
  );
  const header = createTemplate('h1', 'text-2xl font-bold mb-4', '장바구니');
  const cartItems = createTemplate('div', '', '', { id: 'cart-items' });
  const cartTotal = createTemplate('div', 'text-xl font-bold my-4', '', {
    id: 'cart-total',
  });
  const productSelect = createTemplate(
    'select',
    'border rounded p-2 mr-2',
    '',
    { id: 'product-select' }
  );
  const addButton = createTemplate(
    'button',
    'bg-blue-500 text-white px-4 py-2 rounded',
    '추가',
    { id: 'add-to-cart' }
  );

  products.forEach((product) => {
    const option = createTemplate(
      'option',
      '',
      `${product.name}-${product.price}원`,
      { value: product.id }
    );
    productSelect.appendChild(option);
  });

  box.appendChild(header);
  box.appendChild(cartItems);
  box.appendChild(cartTotal);
  box.appendChild(productSelect);
  box.appendChild(addButton);
  wrapper.appendChild(box);
  app.appendChild(wrapper);

  function findProductById(id) {
    return products.find((product) => product.id === id);
  }

  function calculateDiscount(itemId, quantity) {
    if (quantity < MINIMUM_QUANTITY_FOR_DISCOUNT) {
      return 0;
    }

    return discountRates[itemId];
  }

  function updateCart() {
    let total = 0;
    let totalQuantity = 0;
    let totalBeforeDiscount = 0;
    let cartItems = document.getElementById('cart-items').children;

    for (let item of cartItems) {
      const product = findProductById(item.id);
      if (!product) continue;

      const quantity = parseInt(
        item.querySelector('span').textContent.split('x ')[1]
      );
      const itemTotal = product.price * quantity;
      const discount = calculateDiscount(product.id, quantity);

      totalQuantity += quantity;
      totalBeforeDiscount += itemTotal;
      total += itemTotal * (1 - discount);
    }

    let discountRate = 0;
    if (totalQuantity >= BULK_QUANTITY_THRESHOLD) {
      var bulkDiscount = t * BULK_DISCOUNT_RATE;
      var individualDiscount = totalBeforeDiscount - total;
      if (bulkDiscount > individualDiscount) {
        total = totalBeforeDiscount * (1 - BULK_DISCOUNT_RATE);
        discountRate = BULK_DISCOUNT_RATE;
      } else {
        discountRate = (totalBeforeDiscount - total) / totalBeforeDiscount;
      }
    } else {
      discountRate = (totalBeforeDiscount - total) / totalBeforeDiscount;
    }

    const discountPercentage = (discountRate * 100).toFixed(1);

    cartTotal.textContent = '총액: ' + Math.round(total) + '원';
    if (discountRate > 0) {
      const discountSpan = createTemplate(
        'span',
        'text-green-500 ml-2',
        `${discountPercentage}% 할인 적용`
      );
      cartTotal.appendChild(discountSpan);
    }
  }

  addButton.onclick = function () {
    let selectedValue = productSelect.value;
    let product = findProductById(selectedValue);
    if (product) {
      var e = document.getElementById(product.id);
      if (e) {
        var q =
          parseInt(e.querySelector('span').textContent.split('x ')[1]) + 1;
        e.querySelector('span').textContent =
          product.name + ' - ' + product.price + '원 x ' + q;
      } else {
        const d = createTemplate(
          'div',
          'flex justify-between items-center mb-2',
          '',
          { id: product.id }
        );
        const sp = createTemplate(
          'span',
          '',
          `${product.name}-${product.price}원 x 1`
        );
        const bd = createTemplate('div');
        const minusButton = createTemplate(
          'button',
          'quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1',
          '-',
          { 'data-product-id': product.id, 'data-change': -1 }
        );
        const plusButton = createTemplate(
          'button',
          'quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1',
          '+',
          { 'data-product-id': product.id, 'data-chan1ge': 1 }
        );
        const removeButton = createTemplate(
          'button',
          'remove-item bg-red-500 text-white px-2 py-1 rounded',
          '삭제',
          { 'data-product-id': product.id }
        );

        bd.appendChild(minusButton);
        bd.appendChild(plusButton);
        bd.appendChild(removeButton);
        d.appendChild(sp);
        d.appendChild(bd);
        cartItems.appendChild(d);
      }
      updateCart();
    }
  };

  cartItems.onclick = function (event) {
    var target = event.target;
    if (
      target.classList.contains('quantity-change') ||
      target.classList.contains('remove-item')
    ) {
      var productId = target.dataset.productId;
      var item = document.getElementById(productId);
      if (target.classList.contains('quantity-change')) {
        var change = parseInt(target.dataset.change);
        var quantity =
          parseInt(item.querySelector('span').textContent.split('x ')[1]) +
          change;
        if (quantity > 0) {
          item.querySelector('span').textContent =
            item.querySelector('span').textContent.split('x ')[0] +
            'x ' +
            quantity;
        } else {
          item.remove();
        }
      } else if (target.classList.contains('remove-item')) {
        item.remove();
      }
      uc();
    }
  };
}

main();
