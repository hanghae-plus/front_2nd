const CART_ITEMS_STORAGE_KEY = 'cartItems';

export function updateCartItems(newCartItems) {
  localStorage.setItem(CART_ITEMS_STORAGE_KEY, JSON.stringify(newCartItems));
}

export function getCurrentCartItems() {
  return JSON.parse(localStorage.getItem(CART_ITEMS_STORAGE_KEY));
}
