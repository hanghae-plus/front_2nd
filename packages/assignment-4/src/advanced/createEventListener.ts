import { createHtmlFromLiteral } from './createCartView';
import { createShoppingCart } from './createShoppingCart';
import { PRODUCTS } from './product';
import { getCartItemLiteral, getCartTotalLiteral } from './templates';
import { CartItem, DiscountDetail, Product } from './type';
import { replaceExistChild } from './utils/dom';

//TODO 1. +, - 버튼 이벤트
export const itemButtonsOnClick = (
  $cartItemsContainer: HTMLElement,
  target: HTMLElement
) => {
  const { findItem, updateQuantity, getItems } = createShoppingCart();

  if (target.classList.contains('quantity-change')) {
    let productId = target.dataset.productId as string;
    if (target.classList.contains('quantity-change')) {
      let change = parseInt(target.dataset.change);

      const findCartItem = findItem(productId);
      if (!findCartItem) return;

      if (change === 1) {
        updateQuantity(productId, findCartItem.quantity + 1);
      }
      if (change === -1) updateQuantity(productId, findCartItem.quantity - 1);
    }

    const cartItems = getItems();
    const updateCartItemsLiteral = cartItems
      .map((cartItem) => getCartItemLiteral(cartItem))
      .join('');

    const $updateCartItems = createHtmlFromLiteral(updateCartItemsLiteral);
    replaceExistChild($cartItemsContainer, $updateCartItems);
  }
};

export const reRenderTotalPrice = () => {
  const { getTotal } = createShoppingCart();
  const $cartTotalPrice = document.getElementById(
    'cart-total'
  ) as HTMLDivElement;

  const discountDetail = getTotal();
  const cartTotalLiteral = getCartTotalLiteral(discountDetail);
  const $cartTotal = createHtmlFromLiteral(cartTotalLiteral);
  replaceExistChild($cartTotalPrice, $cartTotal);
};

export const appendCartItem = (
  $cartItemsContainer: HTMLDivElement,
  $productSelect: HTMLSelectElement
) => {
  const { addItem, getItems } = createShoppingCart();
  const selectedProductId = $productSelect.value;

  const selectedProduct = PRODUCTS.find(
    (product) => product.id === selectedProductId
  );
  if (!selectedProduct) return;

  addItem(selectedProduct);
  const cartItems = getItems();

  const updateCartItemsLiteral = cartItems
    .map((cartItem) => getCartItemLiteral(cartItem))
    .join('');
  const $updateCartItems = createHtmlFromLiteral(updateCartItemsLiteral);
  replaceExistChild($cartItemsContainer, $updateCartItems);
};
