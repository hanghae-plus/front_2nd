import { createCartItem, createAppTemplate, createCartTotalPrice, createProductOption } from './templates.js';
import { getCurrentCartItems } from './localStorage.js';
import { addItemToCart, updateQuantity, removeItemFromCart } from './eventHandlers.js';
import { products } from './constants.js';
import { calculateTotalPrice, calculateTotalPriceBeforeDiscount, calculateTotalQuantity } from './calculates.js';

function updateTotalPrice() {
  const currentCartItems = getCurrentCartItems();
  // 계산
  const totalQuantity = calculateTotalQuantity(currentCartItems);
  const totalPriceBeforeDiscount = calculateTotalPriceBeforeDiscount(currentCartItems);
  const totalPrice = calculateTotalPrice({ cartItems: currentCartItems, totalQuantity, totalPriceBeforeDiscount });

  const cartTotalElement = document.querySelector('#cart-total');

  const appliedDiscountRate = 1 - totalPrice / totalPriceBeforeDiscount;
  cartTotalElement.innerHTML = createCartTotalPrice({ totalPrice, appliedDiscountRate });
}

function createCartItemElement(itemInfo) {
  const element = document.createElement('div');
  element.id = itemInfo.productId;
  element.className = 'flex justify-between items-center mb-2';
  element.innerHTML = createCartItem(itemInfo);
  return element;
}

function updateCart() {
  const currentCartItems = getCurrentCartItems();
  const cartItemsElement = document.querySelector('#cart-items');
  const currentCartItemElements = [...cartItemsElement.children];
  const currentRenderedProductIds = currentCartItemElements.map((cartItemElement) => cartItemElement.id);
  const productIdsInCurrentCart = Object.keys(currentCartItems);

  // 렌더링된 프로덕트이지만 현재 카트에 없는 경우 제거
  const removedProductIds = currentRenderedProductIds.filter(
    (productId) => !productIdsInCurrentCart.includes(productId),
  );
  removedProductIds.forEach((productId) => {
    const removedElement = currentCartItemElements.find((cartItemElement) => cartItemElement.id === productId);
    removedElement.remove();
  });

  // Update and Insert
  productIdsInCurrentCart.forEach((productId) => {
    const elementWithProductId = currentCartItemElements.find((cartItemElement) => cartItemElement.id === productId);
    // 새로운 프로덕트인 경우
    if (!elementWithProductId) {
      const newCartItemElement = createCartItemElement({
        productId,
        productName: currentCartItems[productId].productName,
        price: currentCartItems[productId].price,
        quantity: currentCartItems[productId].quantity,
      });
      const position = currentRenderedProductIds.findIndex((currentProductId) => {
        const currentProductIdInNumber = parseInt(currentProductId.split('product')[1], 10);
        const productIdInNumber = parseInt(productId.split('product')[1], 10);
        return currentProductIdInNumber > productIdInNumber;
      });

      const referenceElement = position === -1 ? null : currentCartItemElements[position];
      cartItemsElement.insertBefore(newCartItemElement, referenceElement);
      return;
    }

    // 수량이 변경된 경우
    const elementSpan = elementWithProductId.querySelector('span');
    const currentQuantity = parseInt(elementWithProductId.querySelector('span').textContent.split('x ')[1], 10);
    const newQuantity = currentCartItems[productId].quantity;

    if (currentQuantity !== newQuantity) {
      elementSpan.textContent = `${currentCartItems[productId].productName} - ${
        currentCartItems[productId].price
      }원 x ${currentCartItems[productId].quantity}`;
    }
    return;
  });
}

function attachEventListeners() {
  const appRoute = document.querySelector('#app');
  // appRoute에 증감버튼과 상품추가버튼의 이벤트 위임
  appRoute.addEventListener('click', (event) => {
    const { className, dataset, id } = event.target;
    // +, - 버튼
    if (className.includes('quantity-change')) {
      updateQuantity({ productId: dataset.productId, change: dataset.change });
    }
    // 삭제 버튼
    if (className.includes('remove-item')) {
      removeItemFromCart(dataset.productId);
    }
    // 추가 버튼
    if (id === 'add-to-cart') {
      addItemToCart();
    }
  });

  // 로컬스토리지의 cartItems의 업데이트 이벤트 (커스텀)
  window.addEventListener('localStorageUpdated', () => {
    updateCart();
    updateTotalPrice();
  });
}

function renderProductOptions() {
  const productSelect = document.querySelector('#product-select');

  // products가 변경되면 자동으로 옵션들이 바뀔 수 있게
  products.forEach(({ productId, productName, price }) => {
    productSelect.innerHTML += createProductOption({ productId, productName, price });
  });
}

function main() {
  const appRoute = document.querySelector('#app');
  // appRoute에 정적인 템플릿을 렌더링
  appRoute.innerHTML = createAppTemplate();

  // products에 따라 select의 option들을 렌더링
  renderProductOptions();

  // root에 필요한 이벤트 리스너들을 추가
  attachEventListeners();

  // 현재 카트에 담긴 상품들을 렌더링
  updateCart();
  updateTotalPrice();
}

main();
