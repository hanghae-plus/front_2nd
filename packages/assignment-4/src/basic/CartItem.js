import { appendChildElement, createDOMElement } from "./render";

export function CartItem({ selectedProduct }) {
  const cartItem = createDOMElement({
    name: "div",
    options: {
      id: selectedProduct.id,
      className: "flex justify-between items-center mb-2",
    },
  });

  const itemInfo = createDOMElement({
    name: "span",
    options: {
      textContent: `${selectedProduct.name} - ${selectedProduct.price}원 x 1`,
    },
  });

  const buttonContainer = createDOMElement({
    name: "div",
  });

  const minusButton = createDOMElement({
    name: "button",
    options: {
      className:
        "quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1",
      textContent: "-",
      dataset: { productId: selectedProduct.id, change: "-1" },
    },
  });

  const plusButton = createDOMElement({
    name: "button",
    options: {
      className:
        "quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1",
      textContent: "+",
      dataset: { productId: selectedProduct.id, change: "1" },
    },
  });

  const removeButton = createDOMElement({
    name: "button",
    options: {
      className: "remove-item bg-red-500 text-white px-2 py-1 rounded",
      textContent: "삭제",
      dataset: { productId: selectedProduct.id },
    },
  });

  appendChildElement({
    parent: buttonContainer,
    children: [minusButton, plusButton, removeButton],
  });

  appendChildElement({
    parent: cartItem,
    children: [itemInfo, buttonContainer],
  });

  return cartItem;
}
