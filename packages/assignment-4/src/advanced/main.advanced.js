import { createCartView } from './createCartView.js';

/**
 * 상품 목록
 * @type {Array<{productId: string, productName: string, price: number, discount: Array<[number, number]>}>}
 */
const productList = [
  { productId: 'p1', productName: '상품1', price: 10000, discount: [[10, 0.1]] },
  { productId: 'p2', productName: '상품2', price: 20000, discount: [[10, 0.15]] },
  { productId: 'p3', productName: '상품3', price: 30000, discount: [[10, 0.2]] },
];

/**
 * 애플리케이션을 초기화하고 실행합니다.
 */
function initializeApp() {
  const appElement = document.querySelector('#app');
  const { renderCartItems, renderCartTotal } = createCartView(appElement, productList);

  window.addEventListener('cartChange', () => {
    renderCartItems();
    renderCartTotal();
  });
}

// 애플리케이션 실행
initializeApp();
