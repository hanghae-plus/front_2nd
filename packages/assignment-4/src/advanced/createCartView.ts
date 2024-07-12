import { PRODUCTS } from './product';
import {
  getCartItemLiteral,
  getCartTotalLiteral,
  getMainLayoutLiteral,
} from './templates';
import { CartItem } from './entities/cartItem';

import {
  createDOMFromLiteral,
  isDivHTMLElement,
  replaceChildrenFromLiteral,
} from './utils/domHelpers';
import { createShoppingCart } from './createShoppingCart';

export const reRenderCartItems = (cartItems: CartItem[]) => {
  const $cartItemsContainer = document.getElementById('cart-items');
  if (!isDivHTMLElement($cartItemsContainer)) {
    return;
  }

  const updateCartItemsLiteral = cartItems
    .map((cartItem) => getCartItemLiteral(cartItem))
    .join('');
  replaceChildrenFromLiteral($cartItemsContainer, updateCartItemsLiteral);
};

export const reRenderTotalPrice = () => {
  const { getTotal } = createShoppingCart();
  const $cartTotalPrice = document.getElementById('cart-total');
  if (!isDivHTMLElement($cartTotalPrice)) {
    return;
  }

  const totalDiscountDetail = getTotal();

  const cartTotalLiteral = getCartTotalLiteral(totalDiscountDetail);
  replaceChildrenFromLiteral($cartTotalPrice, cartTotalLiteral);
};

export const createCartView = () => {
  const mainLayoutLiteral = getMainLayoutLiteral({ items: PRODUCTS });

  const $app = document.getElementById('app');
  const $mainLayout = createDOMFromLiteral(mainLayoutLiteral);

  $app?.append($mainLayout);
};
