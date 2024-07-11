const CART_ITEMS_STORAGE_KEY = 'cartItems';

const localStorageUpdateEvent = new CustomEvent('localStorageUpdated');

function dispatchLocalStorageUpdateEvent() {
  window.dispatchEvent(localStorageUpdateEvent);
}

export function updateCartItemsObj(newCartItemsObj) {
  localStorage.setItem(CART_ITEMS_STORAGE_KEY, JSON.stringify(newCartItemsObj));
  dispatchLocalStorageUpdateEvent();
}

export function getCartItemsObj() {
  return JSON.parse(localStorage.getItem(CART_ITEMS_STORAGE_KEY)) ?? {};
}
