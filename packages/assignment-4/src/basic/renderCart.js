import {
  appendChildElement,
  appendSelectOptions,
  createDOMElement,
} from "./render";

const renderCart = (products) => {
  const app = document.getElementById("app");
  const container = createDOMElement({
    name: "div",
    options: { className: "bg-gray-100 p-8" },
  });
  appendChildElement({ parent: app, children: [container] });

  const cartContainer = createDOMElement({
    name: "div",
    options: {
      className:
        "max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8",
    },
  });
  appendChildElement({ parent: container, children: [cartContainer] });

  const title = createDOMElement({
    name: "h1",
    options: {
      className: "text-2xl font-bold mb-4",
      textContent: "장바구니",
    },
  });
  const cartItemsContainer = createDOMElement({
    name: "div",
    options: { id: "cart-items" },
  });
  const cartTotalContainer = createDOMElement({
    name: "div",
    options: {
      id: "cart-total",
      className: "text-xl font-bold my-4",
    },
  });
  const addButton = createDOMElement({
    name: "button",
    options: {
      id: "add-to-cart",
      className: "bg-blue-500 text-white px-4 py-2 rounded",
      textContent: "추가",
    },
  });
  const productSelect = createDOMElement({
    name: "select",
    options: {
      id: "product-select",
      className: "border rounded p-2 mr-2",
    },
  });

  appendSelectOptions({ select: productSelect, options: products });

  appendChildElement({
    parent: cartContainer,
    children: [
      title,
      productSelect,
      addButton,
      cartItemsContainer,
      cartTotalContainer,
    ],
  });

  return { cartItemsContainer, cartTotalContainer, addButton, productSelect };
};

export default renderCart;
