// const PRODUCTS = [
//   { id: 'p1', name: '상품1', price: 10_000 },
//   { id: 'p2', name: '상품2', price: 20_000 },
//   { id: 'p3', name: '상품3', price: 30_000 },
// ];

// const TAGS = {
//   div: 'div',
//   h1: 'h1',
//   select: 'select',
//   option: 'option',
//   button: 'button',
//   span: 'span',
// };

// function createElement(tag, props = {}) {
//   const element = document.createElement(tag);

//   Object.keys(props).forEach((key) => {
//     element[key] = props[key];
//   });

//   return element;
// }

// const initialElementSources = {
//   background: { tag: TAGS.div, props: { className: 'bg-gray-100 p-8' } },
//   container: {
//     tag: TAGS.div,
//     props: {
//       className:
//         'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8',
//     },
//   },
//   title: {
//     tag: TAGS.h1,
//     props: {
//       className: 'text-2xl font-bold mb-4',
//       textContent: '장바구니',
//     },
//   },
//   cartItems: {
//     tag: TAGS.div,
//     props: { id: 'cart-items' },
//   },
//   cartTotal: {
//     tag: TAGS.div,
//     props: {
//       id: 'cart-total',
//       className: 'text-xl font-bold my-4',
//     },
//   },
//   select: {
//     tag: TAGS.select,
//     props: {
//       id: 'product-select',
//       className: 'border rounded p-2 mr-2',
//     },
//   },
//   addButton: {
//     tag: TAGS.button,
//     props: {
//       id: 'add-to-cart',
//       className: 'bg-blue-500 text-white px-4 py-2 rounded',
//       textContent: '추가',
//     },
//   },
// };

// function initialize(appElement) {}

// function addSelectOptions(productList, selectElement) {
//   productList.forEach((product) => {
//     selectElement.appendChild(
//       createElement(TAGS.option, {
//         value: product.id,
//         textContent: `${product.name} - ${product.price}원`,
//       })
//     );
//   });
// }

// function main() {
//   const app = document.getElementById('app');

//   const background = createElement(TAGS.div, { className: 'bg-gray-100 p-8' });

//   const container = createElement(TAGS.div, {
//     className:
//       'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8',
//   });

//   const title = createElement(TAGS.h1, {
//     className: 'text-2xl font-bold mb-4',
//     textContent: '장바구니',
//   });

//   const cartItems = createElement(TAGS.div, { id: 'cart-items' });

//   const cartTotal = createElement(TAGS.div, {
//     id: 'cart-total',
//     className: 'text-xl font-bold my-4',
//   });

//   const select = createElement(TAGS.select, {
//     id: 'product-select',
//     className: 'border rounded p-2 mr-2',
//   });

//   const button = createElement(TAGS.button, {
//     id: 'add-to-cart',
//     className: 'bg-blue-500 text-white px-4 py-2 rounded',
//     textContent: '추가',
//     onclick: addToCart,
//   });

//   function addToCart() {
//     const item = PRODUCTS.find(({ id }) => select.value === id);

//     if (!item) return;

//     const element = document.getElementById(item.id);

//     if (element) {
//       console.log('이미 있는 엘리먼트');
//       return;
//     }

//     const cartItemContainer = createElement(TAGS.div, {
//       id: item.id,
//       className: 'flex justify-between items-center mb-2',
//     });

//     const cartItem = createElement(TAGS.span, {
//       textContent: `${item.name} - ${item.price}원 x 1`,
//     });

//     cartItems.appendChild(cartItemContainer);
//     cartItemContainer.appendChild(cartItem);
//   }

//   const containerChildren = [title, cartItems, cartTotal, select, button];

//   app.appendChild(background);
//   background.appendChild(container);

//   containerChildren.forEach((child) => {
//     container.appendChild(child);
//   });
// }

// main();

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App />);
