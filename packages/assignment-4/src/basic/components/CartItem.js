import { createElement } from '../utils/cartUtils';

export function createCartItems() {
  return createElement('div', { id: 'cart-items' });
}

export function createNewCartItem(product) {
  const itemDiv = createElement('div', {
    id: product.id,
    className: 'flex justify-between items-center mb-2',
  });

  const itemSpan = createElement('span', {
    textContent: `${product.name} - ${product.price}원 x 1`,
  });
  const buttonDiv = createElement('div');

  [
    { action: 'minus', text: '-', change: '-1' },
    { action: 'plus', text: '+', change: '1' },
    { action: 'remove', text: '삭제' },
  ].forEach(({ action, text, change }) => {
    const button = createElement('button', {
      className: `quantity-change ${action === 'remove' ? 'remove-item' : ''} ${
        action === 'remove' ? 'bg-red-500' : 'bg-blue-500'
      } text-white px-2 py-1 rounded mr-1`,
      textContent: text,
      'data-product-id': product.id,
      'data-change': change,
    });
    buttonDiv.appendChild(button);
  });

  itemDiv.appendChild(itemSpan);
  itemDiv.appendChild(buttonDiv);
  return itemDiv;
}

export function updateExistingCartItem(itemElement, product) {
  const quantitySpan = itemElement.querySelector('span');
  const currentQuantity = parseInt(quantitySpan.textContent.split('x ')[1]);
  quantitySpan.textContent = `${product.name} - ${product.price}원 x ${currentQuantity + 1}`;
}
