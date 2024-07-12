import { createCartView } from './createCartView.js';
import { createShoppingCart } from './createShoppingCart.js';
import * as Templates from './templates.js';

function main() {
  const { selectedItemsElement, totalPriceElement, selectorElement, addButtonElement } = createCartView();
  const shoppingCart = createShoppingCart();

  console.log('Templates.itemList', Templates.itemList);
  // Populate product options
  for (const item of Templates.itemList) {
    const itemOptionElement = document.createElement('option');
    itemOptionElement.value = item.id;
    itemOptionElement.textContent = `${item.name} - ${item.price}원`;
    selectorElement.appendChild(itemOptionElement);
  }

  addButtonElement.onclick = function () {
    const selectedItemId = selectorElement.value;
    const selectedItem = Templates.itemList.find((item) => item.id === selectedItemId);
    if (selectedItem) {
      shoppingCart.addItem(selectedItem);
      updateCartUI();
    }
  };

  selectedItemsElement.onclick = function (event) {
    const target = event.target;
    if (target.classList.contains('quantity-change')) {
      const productId = target.dataset.productId;
      const change = parseInt(target.dataset.change);
      const currentItem = shoppingCart.getItems().find((item) => item.product.id === productId);
      if (currentItem) {
        const newQuantity = currentItem.quantity + change;
        shoppingCart.updateQuantity(productId, newQuantity);
        updateCartUI();
      }
    } else if (target.classList.contains('remove-item')) {
      const productId = target.dataset.productId;
      shoppingCart.removeItem(productId);
      updateCartUI();
    }
  };

  function updateCartUI() {
    selectedItemsElement.innerHTML = '';
    const items = shoppingCart.getItems();
    for (const item of items) {
      const cartItemElement = document.createElement('div');
      cartItemElement.innerHTML = Templates.CartItem(item);
      selectedItemsElement.appendChild(cartItemElement);
    }

    const { total, discountRate } = shoppingCart.getTotal();
    totalPriceElement.textContent = `총액: ${total}원`;
    if (discountRate > 0) {
      const discountElement = document.createElement('span');
      discountElement.className = 'text-green-500 ml-2';
      discountElement.textContent = `(${(discountRate * 100).toFixed(1)}% 할인 적용)`;
      totalPriceElement.appendChild(discountElement);
    }
  }
}

main();
