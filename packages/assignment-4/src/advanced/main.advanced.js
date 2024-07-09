import { createCartView } from './createCartView.js';

function main() {
  const appRoute = document.querySelector('#app');
  const { renderCartItems, renderCartPrice } = createCartView(appRoute);

  window.addEventListener('cartChange', () => {
    renderCartItems();
    renderCartPrice();
  });
}

main();
