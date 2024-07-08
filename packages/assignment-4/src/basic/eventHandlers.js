import { getCurrentCartItems, updateCartItems } from './localStorage.js';
import { products } from './constants.js';

export function updateQuantity({ productId, change }) {
  const currentCartItems = getCurrentCartItems();
  const newCartItems = structuredClone(currentCartItems);
  newCartItems[productId].quantity += Number(change);
  if (newCartItems[productId].quantity <= 0) {
    delete newCartItems[productId];
  }
  updateCartItems(newCartItems);
}

export function removeItemFromCart(productId) {
  const currentCartItems = getCurrentCartItems();
  const newCartItems = structuredClone(currentCartItems);
  delete newCartItems[productId];
  updateCartItems(newCartItems);
}

export function addItemToCart() {
  const productSelect = document.querySelector('#product-select');
  const selectedProductId = productSelect.value;
  const selectedProduct = products.find(({ productId }) => productId === selectedProductId);

  const currentCartItems = getCurrentCartItems();
  const newCartItems = structuredClone(currentCartItems);
  if (!newCartItems[selectedProductId]) {
    // 최초 추가시
    newCartItems[selectedProductId] = {
      ...selectedProduct,
      quantity: 1,
    };
  } else {
    // 이미 추가된 상품인 경우
    newCartItems[selectedProductId].quantity += 1;
  }
  updateCartItems(newCartItems);
}
