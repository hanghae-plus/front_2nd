import { CartItem, CartTotal } from './templates.js';

export const createCartView = (cart) => {
  const cartItemsContainer = document.getElementById('cart-items');
  const cartTotalContainer = document.getElementById('cart-total');

  function updateCart() {
    const items = cart.getItems();
    const total = cart.getTotal();

    cartItemsContainer.innerHTML = items.map((item) => CartItem(item)).join('');
    cartTotalContainer.innerHTML = CartTotal(total);

    const quantityChangeButtons = document.querySelectorAll('.quantity-change');
    quantityChangeButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const productId = button.dataset.productId;
        const change = parseInt(button.dataset.change);
        const item = items.find((i) => i.product.id === productId);
        cart.updateQuantity(productId, item.quantity + change);
        updateCart();
      });
    });

    const removeButton = document.querySelectorAll('.remove-item');
    removeButton.forEach((button) => {
      button.addEventListener('click', () => {
        const productId = button.dataset.productId;
        cart.removeItem(productId);
        updateCart();
      });
    });
  }

  return {
    updateCart,
  };
};
