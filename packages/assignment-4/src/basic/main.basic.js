const PRODUCTS = [
  { id: 'p1', name: '상품1', price: 10_000, discount: 0.1 },
  { id: 'p2', name: '상품2', price: 20_000, discount: 0.15 },
  { id: 'p3', name: '상품3', price: 30_000, discount: 0.2 },
];

function main() {
  // DOM 생성
  const app = document.getElementById('app');
  const wrapper = createElement('div', { className: 'bg-gray-100 p-8' });
  const container = createElement('div', {
    className:
      'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8',
  });
  const title = createElement('h1', {
    className: 'text-2xl font-bold mb-4',
    textContent: '장바구니',
  });
  const cartItems = createElement('div', { id: 'cart-items' });
  const cartTotal = createElement('div', {
    id: 'cart-total',
    className: 'text-xl font-bold my-4',
  });
  const productSelect = createElement('select', {
    id: 'product-select',
    className: 'border rounded p-2 mr-2',
  });
  const addButton = createElement('button', {
    id: 'add-to-cart',
    className: 'bg-blue-500 text-white px-4 py-2 rounded',
    textContent: '추가',
  });
  PRODUCTS.forEach((product) => {
    const option = createElement('option', {
      value: product.id,
      textContent: `${product.name} - ${product.price}원`,
    });

    productSelect.append(option);
  });
  container.append(title, cartItems, cartTotal, productSelect, addButton);
  wrapper.append(container);
  app.append(wrapper);

  // 로직 연결
  const cart = new Cart();

  on(addButton, 'click', () => {
    const selectedProduct = PRODUCTS.find(
      (product) => product.id === productSelect.value
    );

    if (selectedProduct) {
      cart.addItem(selectedProduct);
      renderCart();
    }
  });

  on(cartItems, 'click', (event) => {
    const target = event.target;

    if (target.classList.contains('quantity-change')) {
      cart.updateQuantity(
        target.dataset.productId,
        parseInt(target.dataset.change)
      );
    }

    if (target.classList.contains('remove-item')) {
      cart.removeItem(target.dataset.productId);
    }

    renderCart();
  });

  function renderCart() {
    cartItems.innerHTML = '';

    cart.getItems().forEach((item) => {
      const itemElement = createElement('div', {
        id: item.product.id,
        className: 'flex justify-between items-center mb-2',
      });
      const span = createElement('span', {
        textContent: `${item.product.name} - ${item.product.price}원 x ${item.quantity}`,
      });
      const buttonContainer = createElement('div');
      const minusButton = createElement('button', {
        className:
          'quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1',
        textContent: '-',
        dataset: { productId: item.product.id, change: '-1' },
      });
      const plusButton = createElement('button', {
        className:
          'quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1',
        textContent: '+',
        dataset: { productId: item.product.id, change: '1' },
      });
      const removeButton = createElement('button', {
        className: 'remove-item bg-red-500 text-white px-2 py-1 rounded',
        textContent: '삭제',
        dataset: { productId: item.product.id },
      });
      buttonContainer.append(minusButton, plusButton, removeButton);
      itemElement.append(span, buttonContainer);
      cartItems.appendChild(itemElement);
    });

    updateCartTotal();
  }

  function updateCartTotal() {
    const { total, discountRate } = cart.getTotal();

    cartTotal.textContent = `총액: ${Math.round(total)}원`;

    if (discountRate > 0) {
      const discountSpan = createElement('span', {
        className: 'text-green-500 ml-2',
        textContent: `(${(discountRate * 100).toFixed(1)}% 할인 적용)`,
      });

      cartTotal.appendChild(discountSpan);
    }
  }
}

class Cart {
  static #TOTAL_DISCOUNT_THRESHOLD = 30;
  static #TOTAL_DISCOUNT_RATE = 0.25;
  static #INDIVIDUAL_DISCOUNT_THRESHOLD = 10;

  constructor() {
    this.items = [];
  }

  findItem(productId) {
    return this.items.find(({ product }) => product.id === productId);
  }

  addItem(product) {
    const existingItem = this.findItem(product.id);

    if (existingItem) {
      existingItem.quantity += 1;

      return;
    }

    this.items.push({ product, quantity: 1 });
  }

  removeItem(productId) {
    this.items = this.items.filter(({ product }) => product.id !== productId);
  }

  updateQuantity(productId, quantityChange) {
    const item = this.findItem(productId);

    if (!item) return;

    item.quantity += quantityChange;

    if (item.quantity <= 0) this.removeItem(productId);
  }

  getItems() {
    return this.items;
  }

  getTotal() {
    const totalQuantity = this.items.reduce(
      (acc, { quantity }) => acc + quantity,
      0
    );
    if (totalQuantity >= Cart.#TOTAL_DISCOUNT_THRESHOLD) {
      const total = this.items.reduce(
        (acc, { product, quantity }) => acc + product.price * quantity,
        0
      );

      return {
        total: total * (1 - Cart.#TOTAL_DISCOUNT_RATE),
        discountRate: Cart.#TOTAL_DISCOUNT_RATE,
      };
    }

    const totalBeforeDiscount = this.items.reduce(
      (acc, { product, quantity }) => acc + product.price * quantity,
      0
    );
    const total = this.items.reduce((acc, { product, quantity }) => {
      if (quantity >= Cart.#INDIVIDUAL_DISCOUNT_THRESHOLD) {
        return acc + product.price * quantity * (1 - product.discount);
      }

      return acc + product.price * quantity;
    }, 0);

    return {
      total,
      discountRate: (totalBeforeDiscount - total) / totalBeforeDiscount,
    };
  }
}

// 유틸성 함수들
function createElement(tag, attributes = {}) {
  const element = document.createElement(tag);

  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'dataset') {
      Object.assign(element.dataset, value);
    } else {
      element[key] = value;
    }
  });

  return element;
}

function on(element, eventType, handler) {
  element.addEventListener(eventType, handler);
}

main();
