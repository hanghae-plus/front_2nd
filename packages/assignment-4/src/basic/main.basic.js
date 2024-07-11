import {
  createCartItems,
  createNewCartItem,
  updateExistingCartItem,
} from './components/CartItem.js';
import {
  BULK_DISCOUNT_THRESHOLD,
  PRODUCTS,
  TOTAL_BULK_DISCOUNT_RATE,
  TOTAL_BULK_DISCOUNT_THRESHOLD,
} from './constants/products';
import { calculateCartTotals, createElement } from './utils/cartUtils.js';

function Cart() {
  const app = document.getElementById('app');
  const cartItems = createCartItems();
  const cartTotal = createElement('div', { id: 'cart-total', className: 'text-xl font-bold my-4' });
  const productSelect = createProductSelect();
  const addToCartButton = createElement('button', {
    id: 'add-to-cart',
    className: 'bg-blue-500 text-white px-4 py-2 rounded',
    textContent: '추가',
  });

  const cartContainer = createElement('div', {
    className: 'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8',
  });
  cartContainer.appendChild(
    createElement('h1', { className: 'text-2xl font-bold mb-4', textContent: '장바구니' })
  );
  cartContainer.appendChild(cartItems);
  cartContainer.appendChild(cartTotal);
  cartContainer.appendChild(productSelect);
  cartContainer.appendChild(addToCartButton);

  const wrapper = createElement('div', { className: 'bg-gray-100 p-8' });
  wrapper.appendChild(cartContainer);
  app.appendChild(wrapper);

  addToCartButton.addEventListener('click', () => addToCart(productSelect.value, cartItems));
  cartItems.addEventListener('click', handleCartItemActions);

  updateCartTotal();
}

function createProductSelect() {
  const select = createElement('select', {
    id: 'product-select',
    className: 'border rounded p-2 mr-2',
  });

  PRODUCTS.forEach((product) => {
    const option = createElement('option', {
      value: product.id,
      textContent: `${product.name} - ${product.price}원`,
    });
    select.appendChild(option);
  });

  return select;
}

function addToCart(productId, cartItemsContainer) {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return;

  const existingItem = document.getElementById(productId);
  if (existingItem) {
    updateExistingCartItem(existingItem, product);
  } else {
    cartItemsContainer.appendChild(createNewCartItem(product));
  }

  updateCartTotal();
}

function handleCartItemActions(event) {
  const target = event.target;
  if (!target.classList.contains('quantity-change') && !target.classList.contains('remove-item'))
    return;

  const productId = target.dataset.productId;
  const itemElement = document.getElementById(productId);
  if (!itemElement) return;

  const quantitySpan = itemElement.querySelector('span');
  let [itemInfo, quantity] = quantitySpan.textContent.split('x ');
  quantity = parseInt(quantity);

  if (target.classList.contains('remove-item')) {
    itemElement.remove();
  } else {
    const change = parseInt(target.dataset.change);
    quantity += change;
    if (quantity > 0) {
      quantitySpan.textContent = `${itemInfo}x ${quantity}`;
    } else {
      itemElement.remove();
    }
  }

  updateCartTotal();
}

function updateCartTotal() {
  const cartItems = Array.from(document.getElementById('cart-items').children);
  const { totalQuantity, totalBeforeDiscount, totalAfterDiscount } = calculateCartTotals(
    cartItems,
    PRODUCTS,
    BULK_DISCOUNT_THRESHOLD,
    TOTAL_BULK_DISCOUNT_THRESHOLD,
    TOTAL_BULK_DISCOUNT_RATE
  );

  const discountRate =
    totalBeforeDiscount > 0 ? (totalBeforeDiscount - totalAfterDiscount) / totalBeforeDiscount : 0;
  const cartTotalElement = document.getElementById('cart-total');

  cartTotalElement.textContent = `총액: ${Math.round(totalAfterDiscount)}원`;

  if (discountRate > 0) {
    const discountSpan = createElement('span', {
      className: 'text-green-500 ml-2',
      textContent: `(${(discountRate * 100).toFixed(1)}% 할인 적용)`,
    });
    cartTotalElement.appendChild(discountSpan);
  }
}

Cart();
