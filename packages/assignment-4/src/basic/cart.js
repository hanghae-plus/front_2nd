import { ITEMS, DISCOUNT_RATES } from './constants.js';
import { createHTMLElement, calculateTotalPrice } from './helpers.js';

export function updateCartDisplay(cartItems, totalPriceElement) {
  const finalPrice = calculateTotalPrice(cartItems, DISCOUNT_RATES);
  const discountRate = cartItems.length
    ? (cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) - finalPrice) /
      cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
    : 0;

  totalPriceElement.innerHTML = `총액: ${Math.round(finalPrice)}원${discountRate > 0 ? `<span style="color: #48bb78; margin-left: 0.5rem;">(${(discountRate * 100).toFixed(1)}% 할인 적용)</span>` : ''}`;
}

export function addItemToCart(selectedItem, cartItemsElement, cartItems, totalPriceElement) {
  const existingCartItem = cartItems.find((item) => item.id === selectedItem.id);

  if (existingCartItem) {
    existingCartItem.quantity += 1;
    document.getElementById(existingCartItem.id).querySelector('.item-info').textContent =
      `${existingCartItem.name} - ${existingCartItem.price}원 x ${existingCartItem.quantity}`;
  } else {
    const cartItem = { ...selectedItem, quantity: 1 };
    cartItems.push(cartItem);

    const cartItemElement = createHTMLElement('div', {
      attributes: {
        id: cartItem.id,
        class: 'cart-item',
        style: 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;',
      },
    });
    cartItemElement.innerHTML = `
      <span class="item-info">${cartItem.name} - ${cartItem.price}원 x ${cartItem.quantity}</span>
      <div>
        <button class="quantity-change" style="background-color: #4299e1; color: #fff; padding: 0.5rem; border-radius: 0.25rem; margin-right: 0.25rem;" data-id="${cartItem.id}" data-change="-1">-</button>
        <button class="quantity-change" style="background-color: #4299e1; color: #fff; padding: 0.5rem; border-radius: 0.25rem; margin-right: 0.25rem;" data-id="${cartItem.id}" data-change="1">+</button>
        <button class="remove-item" data-product-id="${cartItem.id}" style="background-color: #f56565; color: #fff; padding: 0.5rem; border-radius: 0.25rem;" data-id="${cartItem.id}">삭제</button>
      </div>
    `;
    cartItemsElement.appendChild(cartItemElement);
  }

  updateCartDisplay(cartItems, totalPriceElement);
}

export function handleCartChange(event, cartItems, cartItemsElement, totalPriceElement) {
  const target = event.target;
  const productId = target.dataset.id;
  const cartItem = cartItems.find((item) => item.id === productId);

  if (!cartItem) return;

  if (target.classList.contains('quantity-change')) {
    const change = parseInt(target.dataset.change);
    cartItem.quantity += change;

    if (cartItem.quantity > 0) {
      document.getElementById(cartItem.id).querySelector('.item-info').textContent =
        `${cartItem.name} - ${cartItem.price}원 x ${cartItem.quantity}`;
    } else {
      document.getElementById(cartItem.id).remove();
      cartItems.splice(cartItems.indexOf(cartItem), 1);
    }
  } else if (target.classList.contains('remove-item')) {
    document.getElementById(cartItem.id).remove();
    cartItems.splice(cartItems.indexOf(cartItem), 1);
  }

  updateCartDisplay(cartItems, totalPriceElement);
}
