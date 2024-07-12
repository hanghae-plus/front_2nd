export const createCartView = () => {
  const appElement = document.getElementById('app');
  const containerElement = document.createElement('div');
  const cardElement = document.createElement('div');
  const titleElement = document.createElement('h1');
  const selectedItemsElement = document.createElement('div');
  const totalPriceElement = document.createElement('div');
  const selectorElement = document.createElement('select');
  const addButtonElement = document.createElement('button');

  selectedItemsElement.id = 'cart-items';
  totalPriceElement.id = 'cart-total';
  selectorElement.id = 'product-select';
  addButtonElement.id = 'add-to-cart';
  containerElement.className = 'bg-gray-100 p-8';
  cardElement.className = 'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';
  titleElement.className = 'text-2xl font-bold mb-4';
  totalPriceElement.className = 'text-xl font-bold my-4';
  selectorElement.className = 'border rounded p-2 mr-2';
  addButtonElement.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  titleElement.textContent = '장바구니';
  addButtonElement.textContent = '추가';

  cardElement.appendChild(titleElement);
  cardElement.appendChild(selectedItemsElement);
  cardElement.appendChild(totalPriceElement);
  cardElement.appendChild(selectorElement);
  cardElement.appendChild(addButtonElement);
  containerElement.appendChild(cardElement);
  appElement.appendChild(containerElement);

  return { selectedItemsElement, totalPriceElement, selectorElement, addButtonElement };
};
