import { MainLayout, CartItem, CartTotal } from './templates';
import { createShoppingCart } from './createShoppingCart';

const cart = createShoppingCart();

// --- 기능 함수 ---
const getQuantity = (id) => {
  let quantity = {};
  cart.getItems().forEach((item) => {
    quantity[item.product.id] = item.quantity;
  });
  return quantity[id];
};

const getSelectedProdId = (e) => {
  return e.target.dataset.productId;
};

// --- element 생성 함수 ---
const tmpComponent = document.createElement('div');

const createElement = (htmlString) => {
  tmpComponent.innerHTML = htmlString;
  return tmpComponent.firstChild;
};

const createBaseUI = (products) => {
  const $mainLayout = createElement(MainLayout({ items: products }));
  const $addBtn = $mainLayout.querySelector('#add-to-cart');

  $addBtn.addEventListener('click', () => handleClickAdd(products));
  return $mainLayout;
};

function createCartItem(product) {
  const newItem = createElement(CartItem({ product, quantity: 1 }));

  findItemsContainer().appendChild(newItem);

  const [minus, plus, remove] = newItem.querySelectorAll('button');

  minus.addEventListener('click', handleClickMinus);
  plus.addEventListener('click', handleClickPlus);
  remove.addEventListener('click', handleClickRemove);
}

// --- element 검색 함수 ---
const findItemsContainer = () => {
  return document.querySelector('#cart-items');
};

const findSelectElement = () => {
  return document.querySelector('select');
};

const findCartItem = (id) => {
  return Array.from(findItemsContainer().children).find(
    (child) => child.querySelector('button').dataset.productId === id
  );
};

// --- element 수정 함수 ---
const updateItemCount = (id) => {
  const item = findCartItem(id);
  const priceInfo = item.querySelector('span');
  priceInfo.textContent = `${priceInfo.textContent.split('x ')[0]}x ${getQuantity(id)}`;
};

const removeItem = (item) => {
  findItemsContainer().removeChild(item.parentNode.parentNode);
};

const updateTotal = () => {
  const $total = findTotalPriceElement();
  $total.textContent = CartTotal(cart.getTotal());
};

// --- event handler ---
function handleClickAdd(products) {
  const selectedId = findSelectElement().value;
  const quantity = getQuantity(selectedId);

  if (quantity) {
    cart.updateQuantity(selectedId, quantity + 1);
  } else {
    const newProduct = products.find((product) => product.id === selectedId);

    createCartItem(newProduct);
    cart.addItem(newProduct);
  }

  updateItemCount(selectedId);

  updateTotal();
}

const handleClickPlus = (e) => {
  const selectedId = getSelectedProdId(e);

  cart.updateQuantity(selectedId, getQuantity(selectedId) + 1);

  updateItemCount(selectedId);
  updateTotal();
};

const handleClickMinus = (e) => {
  const selectedId = getSelectedProdId(e);

  cart.updateQuantity(selectedId, getQuantity(selectedId) - 1);

  if (getQuantity(selectedId) > 0) {
    updateItemCount(selectedId);
  } else {
    removeItem(e.target);
  }
  updateTotal();
};

const handleClickRemove = (e) => {
  const selectedId = getSelectedProdId(e);

  cart.removeItem(selectedId);
  removeItem(e.target);
  updateTotal();
};

const findTotalPriceElement = () => {
  return document.querySelector('#cart-total');
};

export const createCartView = (products) => {
  // --- view 생성 ---
  const $app = document.getElementById('app');
  const $mainLayout = createBaseUI(products);

  $app.appendChild($mainLayout);
};
