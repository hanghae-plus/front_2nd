import { reRenderCartItems } from './createCartView';
import { createShoppingCart } from './createShoppingCart';
import { PRODUCTS } from './product';
import { isDivHTMLElement, isSelectHTMLElement } from './utils/domHelpers';

export const setEvent = <K extends keyof HTMLElementEventMap>(
  eventType: K,
  targetElementId: string,
  eventFunction: (event: HTMLElementEventMap[K]) => void
) => {
  const $targetElement = document.getElementById(targetElementId);

  if (!$targetElement) {
    return;
  }

  $targetElement.addEventListener(eventType, eventFunction);
};

export const itemButtonsOnClick = (targetHTMLElement: HTMLElement) => {
  const { removeItem, findItem, updateQuantity, getCurrentCartItems } =
    createShoppingCart();

  let targetProductId = targetHTMLElement.dataset.productId;
  if (!targetProductId) {
    return;
  }

  if (targetHTMLElement.closest('.quantity-change')) {
    let changeValue = parseInt(targetHTMLElement.dataset.change as string);
    if (!changeValue) {
      return;
    }

    const currentCartItem = findItem(targetProductId);
    if (!currentCartItem) return;

    const newQuantity = currentCartItem.quantity + changeValue;
    updateQuantity(targetProductId, newQuantity);

    const cartItems = getCurrentCartItems();
    reRenderCartItems(cartItems);
  }

  if (targetHTMLElement.closest('.remove-item')) {
    removeItem(targetProductId);
  }
};

export const appendCartItem = () => {
  const $cartSelectElement = document.getElementById('product-select');
  const $cartItemsContainer = document.getElementById('cart-items');

  if (
    !isSelectHTMLElement($cartSelectElement) ||
    !isDivHTMLElement($cartItemsContainer)
  ) {
    return;
  }

  const { addItem, getCurrentCartItems } = createShoppingCart();
  const selectedProductId = $cartSelectElement.value;

  const selectedProduct = PRODUCTS.find(
    (product) => product.id === selectedProductId
  );
  if (!selectedProduct) {
    return;
  }

  addItem(selectedProduct);

  const cartItems = getCurrentCartItems();

  reRenderCartItems(cartItems);
};
