import {
  createCartItemElement,
  createAppTemplateElement,
  createCartTotalPriceElement,
  createProductOptionElement,
} from './templates.js';
import { getCartItemsObj } from './localStorage.js';
import { addItemToCart, updateQuantity, removeItemFromCart } from './eventHandlers.js';
import { productList } from './shopInfos.js';
import {
  calculateTotalPrice,
  calculateTotalPriceBeforeDiscount,
  calculateTotalQuantity,
  calculateAppliedDiscountRate,
} from './calculates.js';

function updateTotalPriceElement() {
  const cartItemsObj = getCartItemsObj();
  const totalQuantity = calculateTotalQuantity(cartItemsObj);
  const totalPriceBeforeDiscount = calculateTotalPriceBeforeDiscount(cartItemsObj);
  const totalPrice = calculateTotalPrice({ cartItemsObj, totalQuantity, totalPriceBeforeDiscount });

  const cartTotalElement = document.querySelector('#cart-total');
  const appliedDiscountRate = calculateAppliedDiscountRate(totalPrice, totalPriceBeforeDiscount);
  cartTotalElement.innerHTML = createCartTotalPriceElement({ totalPrice, appliedDiscountRate });
}

function updateCartElement() {
  const cartItemsObj = getCartItemsObj();
  const cartItemsElement = document.querySelector('#cart-items');
  const currentCartItemElements = [...cartItemsElement.children];
  const currentRenderedProductIds = currentCartItemElements.map((cartItemElement) => cartItemElement.id);
  const productIdsInCurrentCart = Object.keys(cartItemsObj);

  // 렌더링된 프로덕트이지만 현재 카트에 없는 경우 제거
  const removedProductIds = currentRenderedProductIds.filter(
    (productId) => !productIdsInCurrentCart.includes(productId),
  );
  removedProductIds.forEach((productId) => {
    const removedElement = document.getElementById(productId);
    if (removedElement) removedElement.remove();
  });

  // 업데이트 및 삽입
  productIdsInCurrentCart.forEach((productId) => {
    const existingElement = document.getElementById(productId);
    const { productName, price, quantity } = cartItemsObj[productId];

    if (!existingElement) {
      // 새로운 프로덕트인 경우
      const newCartItemElement = createCartItemElement({ productId, productName, price, quantity });
      cartItemsElement.insertAdjacentHTML('beforeend', newCartItemElement);
    } else {
      // 수량이 변경된 경우
      const quantityElement = existingElement.querySelector('span');
      quantityElement.textContent = `${productName} - ${price}원 x ${quantity}`;
    }
  });
}

function attachEventListeners() {
  const appElement = document.querySelector('#app');
  appElement.addEventListener('click', (event) => {
    const { className, dataset } = event.target;
    if (className.includes('quantity-change')) {
      updateQuantity({ productId: dataset.productId, change: dataset.change });
    }
    if (className.includes('remove-item')) {
      removeItemFromCart(dataset.productId);
    }
    if (event.target.id === 'add-to-cart') {
      addItemToCart();
    }
  });

  window.addEventListener('localStorageUpdated', () => {
    updateCartElement();
    updateTotalPriceElement();
  });
}

function renderProductOptions() {
  const productSelectElement = document.querySelector('#product-select');
  productList.forEach(({ productId, productName, price }) => {
    const optionElement = createProductOptionElement({ productId, productName, price });
    productSelectElement.insertAdjacentHTML('beforeend', optionElement);
  });
}

function initializeApp() {
  const appElement = document.querySelector('#app');
  appElement.innerHTML = createAppTemplateElement();

  renderProductOptions();
  attachEventListeners();
  updateCartElement();
  updateTotalPriceElement();
}

initializeApp();
