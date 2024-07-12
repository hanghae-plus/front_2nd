import { createItemOptionElement, createMainViewElement } from '../template/cartTemplate.js';

const mainViewConfig = createMainViewElement();

function renderItemOptions({ itemList }) {
  const productSelectElement = document.getElementById('product-select');
  itemList.forEach((item) => {
    const itemOption = createItemOptionElement(item);
    productSelectElement.insertAdjacentHTML('beforeend', itemOption);
  });
}

export function renderMainView({ itemList }) {
  const appElement = document.getElementById('app');
  appElement.innerHTML = mainViewConfig;
  renderItemOptions({ itemList });
}
