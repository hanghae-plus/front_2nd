import { createCartView } from './createCartView.js';

// main.js에 있던 products와 같은 형태를 우선 사용
const products = [
  { productId: 'p1', productName: '상품1', price: 10000, discount: [[10, 0.1]] },
  { productId: 'p2', productName: '상품2', price: 20000, discount: [[10, 0.15]] },
  { productId: 'p3', productName: '상품3', price: 30000, discount: [[10, 0.2]] },
];

function main() {
  const appRoute = document.querySelector('#app');
  const { renderCartItems, renderCartTotal } = createCartView(appRoute, products);

  window.addEventListener('cartChange', () => {
    renderCartItems();
    renderCartTotal();
  });
}

main();
