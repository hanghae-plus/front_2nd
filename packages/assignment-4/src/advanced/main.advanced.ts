import { createCartView, createHtmlFromLiteral } from './createCartView';
import {
  appendCartItem,
  itemButtonsOnClick,
  reRenderTotalPrice,
} from './createEventListener';
import { createShoppingCart } from './createShoppingCart';
import { getCartItemLiteral } from './templates';
import { replaceExistChild } from './utils/dom';

type CustomElement = Element & {
  dataset: {
    productId: string;
  };
};

function main() {
  const { removeItem, getItems } = createShoppingCart();
  createCartView();

  const $cartSelectElement = document.getElementById(
    'product-select'
  ) as HTMLSelectElement;
  const $addItemBtn = document.getElementById(
    'add-to-cart'
  ) as HTMLButtonElement;
  const $cartItemsContainer = document.getElementById(
    'cart-items'
  ) as HTMLDivElement;

  $cartItemsContainer.addEventListener('click', (event) => {
    if (!(event.target as HTMLElement).closest('.remove-item')) return false;
    const productId = (
      (event.target as HTMLElement).closest('.remove-item') as CustomElement
    ).dataset.productId;
    removeItem(productId);
    const cartItems = getItems();
    const updateCartItemsLiteral = cartItems
      .map((cartItem) => getCartItemLiteral(cartItem))
      .join('');
    const $updateCartItems = createHtmlFromLiteral(updateCartItemsLiteral);
    replaceExistChild($cartItemsContainer, $updateCartItems);
    reRenderTotalPrice();
  });

  $cartItemsContainer.addEventListener('click', (event) => {
    itemButtonsOnClick($cartItemsContainer, event.target as HTMLElement);
    reRenderTotalPrice();
  });

  // 추가 버튼 클릭
  $addItemBtn.addEventListener('click', () => {
    appendCartItem($cartItemsContainer, $cartSelectElement);
    reRenderTotalPrice();
  });
}

main();
