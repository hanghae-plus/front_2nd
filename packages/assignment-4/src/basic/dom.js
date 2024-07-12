import { generateItemOptions } from './helpers.js';

export function setupDOM(items) {
  const appElement = document.getElementById('app');

  appElement.innerHTML = `
    <div style="background-color: #f7fafc; padding: 2rem;">
      <div style="max-width: 42rem; margin: auto; background-color: #fff; border-radius: 0.75rem; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden; padding: 2rem;">
        <h1 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem;">장바구니</h1>
        <div id="cart-items"></div>
        <div id="cart-total" style="font-size: 1.25rem; font-weight: 700; margin: 1rem 0;"></div>
        <select id="product-select" style="border-width: 1px; border-radius: 0.25rem; padding: 0.5rem; margin-right: 0.5rem;">
          ${generateItemOptions(items)}
        </select>
        <button id="add-to-cart" style="background-color: #4299e1; color: #fff; padding: 0.5rem 1rem; border-radius: 0.25rem;">추가</button>
      </div>
    </div>
  `;

  return {
    cartItemsElement: document.getElementById('cart-items'),
    totalPriceElement: document.getElementById('cart-total'),
    selectorElement: document.getElementById('product-select'),
    addButtonElement: document.getElementById('add-to-cart'),
  };
}
