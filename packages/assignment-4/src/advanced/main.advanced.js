import { createShoppingCart } from './createShoppingCart.js';
import { productList } from './data/product.js';
import { MainLayout } from './templates.js';
import { createNodeFromHTML } from './utils/domUtils.js';
import { createCartView } from './createCartView.js';

/**
 * 애플리케이션의 메인 함수
 * DOM을 초기화하고 장바구니 뷰를 설정합니다.
 * @function
 */
function main() {
  const appElement = initializeDOM();
  const cart = createShoppingCart();
  initializeCartView(cart);
}

/**
 * DOM을 초기화하고 메인 레이아웃을 추가합니다.
 * @function
 * @returns {HTMLElement} 초기화된 앱 요소
 */
function initializeDOM() {
  const appElement = document.getElementById('app');
  const layoutElement = createNodeFromHTML(MainLayout({ items: productList }));
  appElement.appendChild(layoutElement);
  return appElement;
}

/**
 * 장바구니 뷰를 초기화하고 렌더링합니다.
 * @function
 * @param {Object} cart - 장바구니 객체
 */
function initializeCartView(cart) {
  const cartView = createCartView(cart, productList);
  cartView.init();
  cartView.render();
}

main();
