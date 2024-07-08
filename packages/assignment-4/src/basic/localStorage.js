const CART_ITEMS_STORAGE_KEY = 'cartItems';

const localStorageUpdateEvent = new CustomEvent('localStorageUpdated');

function updateLocalStorage() {
  window.dispatchEvent(localStorageUpdateEvent);
}

export function updateCartItems(newCartItems) {
  localStorage.setItem(CART_ITEMS_STORAGE_KEY, JSON.stringify(newCartItems));
  updateLocalStorage();
}

export function getCurrentCartItems() {
  return JSON.parse(localStorage.getItem(CART_ITEMS_STORAGE_KEY)) ?? {};
}
