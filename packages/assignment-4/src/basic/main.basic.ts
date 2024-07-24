import {
  createCartView,
  reRenderCartItems,
  reRenderTotalPrice,
} from './createCartView.ts';
import {
  appendCartItem,
  itemButtonsOnClick,
  setEvent,
} from './createEventListener.ts';
import { createShoppingCart } from './createShoppingCart.ts';
import { isHTMLElement } from './utils/domHelpers.ts';

function main() {
  const { getCurrentCartItems } = createShoppingCart();
  createCartView();

  setEvent('click', 'cart-items', (event) => {
    if (!isHTMLElement(event.target)) {
      return;
    }
    itemButtonsOnClick(event.target);

    const currentCartItems = getCurrentCartItems();
    reRenderCartItems(currentCartItems);

    reRenderTotalPrice();
  });

  setEvent('click', 'add-to-cart', () => {
    appendCartItem();
    reRenderTotalPrice();
  });
}

main();
