import { createShoppingCart } from './createShoppingCart.js';
import { createCartView } from './createCartView.js';
import * as templates from './templates.js';

const PRODUCTS = [
  { id: 'p1', name: '상품1', price: 10000, discount: [[10, 0.1]] },
  { id: 'p2', name: '상품2', price: 20000, discount: [[10, 0.15]] },
  { id: 'p3', name: '상품3', price: 30000, discount: [[10, 0.2]] },
];

function main() {
  const cart = createShoppingCart();
  const view = createCartView(cart, templates, PRODUCTS);
  const app = document.getElementById('app');
  const { renderCart, renderProductOptions } = view.render(app);

  renderProductOptions();
  renderCart();
}

main();
