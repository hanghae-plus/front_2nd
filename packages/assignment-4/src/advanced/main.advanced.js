import createShoppingCart from './createShoppingCart.js';
import createCartView from './createCartView.js';
import templates from './templates.js';

function main() {
    const cart = createShoppingCart();
    const cartView = createCartView(cart, templates);
  
    cartView.render();
    
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.addEventListener('click', cartView.handleCartItemAction);
}

main();