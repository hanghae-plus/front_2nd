import { createCartView } from './createCartView.js';
import { createShoppingCart } from './createShoppingCart.js';

function main() {
  const cart = createShoppingCart();
  createCartView(cart);
}

main();
