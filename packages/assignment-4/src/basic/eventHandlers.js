import { getCurrentCartItems, updateCartItems } from './localStorage.js';
import { products } from './shopInfos.js';

export function updateQuantity({ productId, change }) {
  const cartItemsObj = getCurrentCartItems();
  const newCartItemsObj = structuredClone(cartItemsObj);
  newCartItemsObj[productId].quantity += Number(change);

  if (newCartItemsObj[productId].quantity <= 0) {
    delete newCartItemsObj[productId];
  }

  updateCartItems(newCartItemsObj);
}

export function removeItemFromCart(productId) {
  const cartItemsObj = getCurrentCartItems();
  const newCartItemsObj = structuredClone(cartItemsObj);
  delete newCartItemsObj[productId];
  updateCartItems(newCartItemsObj);
}

export function addItemToCart() {
  const productSelectElement = document.querySelector('#product-select');
  const selectedProductId = productSelectElement.value;
  const selectedProductObj = products.find(({ productId }) => productId === selectedProductId);

  const cartItemsObj = getCurrentCartItems();
  const newCartItemsObj = structuredClone(cartItemsObj);

  if (!newCartItemsObj[selectedProductId]) {
    newCartItemsObj[selectedProductId] = {
      ...selectedProductObj,
      quantity: 1,
    };
  } else {
    newCartItemsObj[selectedProductId].quantity += 1;
  }

  updateCartItems(newCartItemsObj);
}
