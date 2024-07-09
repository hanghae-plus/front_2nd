import { MainLayout, ProductOption, CartItem, CartTotal } from './templates.js';
import { products } from './shopInfos.js';
import { createShoppingCart } from './createShoppingCart.js';

export const createCartView = (root) => {
  root.innerHTML = MainLayout();

  const productSelect = document.querySelector('#product-select');
  products.forEach((product) => {
    const { productId, productName, price } = product;
    productSelect.innerHTML += ProductOption({ productId, productName, price });
  });

  const { getItems, getTotal, addItem, removeItem, updateQuantity } = createShoppingCart();

  // add Events on root
  root.addEventListener('click', (event) => {
    const { dataset, id, className } = event.target;
    // +, - 버튼
    if (className.includes('quantity-change')) {
      updateQuantity({ productId: dataset.productId, change: dataset.change });
    }
    // 삭제 버튼
    if (className.includes('remove-item')) {
      removeItem(dataset.productId);
    }
    // 추가 버튼
    if (id === 'add-to-cart') {
      addItem(productSelect.value);
    }
  });

  const cartItemsContainer = document.querySelector('#cart-items');

  const renderCartItems = () => {
    const items = getItems();
    const renderedCartItemElements = [...cartItemsContainer.childNodes];

    // remove not existing
    renderedCartItemElements.forEach((element) => {
      if (!items[element.id]) {
        element.remove();
      }
    });

    // update and insert
    Object.keys(items).forEach((productId) => {
      const { productName, price } = products.find((product) => product.productId === productId);
      const { quantity } = items[productId];

      const cartItemElement = renderedCartItemElements.find((element) => element.id === productId);
      // insert
      if (!cartItemElement) {
        const newCartItemElementTemplate = CartItem({ productId, productName, price, quantity });
        cartItemsContainer.innerHTML += newCartItemElementTemplate;
        return;
      }

      // update
      const targetSpan = cartItemElement.querySelector('span');
      const prevQuantity = parseInt(targetSpan.textContent.split('x ')[1], 10);
      const newQuantity = items[productId].quantity;
      if (prevQuantity !== newQuantity) {
        targetSpan.textContent = `${productName} - ${price}원 x ${newQuantity}`;
      }
      return;
    });
  };

  const cartTotalElement = document.querySelector('#cart-total');

  const renderCartPrice = () => {
    const { total, discountRate } = getTotal();
    cartTotalElement.innerHTML = CartTotal({ total, discountRate });
  };

  return { renderCartItems, renderCartPrice };
};
