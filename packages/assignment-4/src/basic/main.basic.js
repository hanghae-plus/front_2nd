import { ITEMS } from './constants.js';
import { setupDOM } from './dom.js';
import { addItemToCart, handleCartChange } from './cart.js';

function main() {
  const { cartItemsElement, totalPriceElement, selectorElement, addButtonElement } = setupDOM(ITEMS);
  const cartItems = [];

  addButtonElement.addEventListener('click', () => {
    const selectedItem = ITEMS.find((item) => item.id === selectorElement.value);
    if (selectedItem) addItemToCart(selectedItem, cartItemsElement, cartItems, totalPriceElement);
  });

  cartItemsElement.addEventListener('click', (event) =>
    handleCartChange(event, cartItems, cartItemsElement, totalPriceElement),
  );
}

main();
