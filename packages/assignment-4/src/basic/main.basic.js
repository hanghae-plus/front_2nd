import {
  createDOMElement,
  appendChildElement,
  appendSelectOptions,
  setAttribute,
} from "./render";
import {
  findProduct,
  getCartItemText,
  getDiscountRateById,
  calculateDiscountRate,
  MAX_DISCOUNT_RATE,
} from "./utils";

const PRODUCTS = [
  { id: "p1", name: "상품1", price: 10000 },
  { id: "p2", name: "상품2", price: 20000 },
  { id: "p3", name: "상품3", price: 30000 },
];

function main() {
  const app = document.getElementById("app");
  const container = createDOMElement({
    name: "div",
    options: { className: "bg-gray-100 p-8" },
  });
  appendChildElement({
    parent: app,
    children: [container],
  });

  const cartContainer = createDOMElement({
    name: "div",
    options: {
      className:
        "max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8",
    },
  });
  appendChildElement({
    parent: container,
    children: [cartContainer],
  });

  const title = createDOMElement({
    name: "h1",
    options: { className: "text-2xl font-bold mb-4", textContent: "장바구니" },
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
  appendChildElement({
    parent: cartContainer,
    children: [
      title,
      cartItemsContainer,
      cartTotalContainer,
      productSelect,
      addButton,
    ],
  });

  appendSelectOptions({ select: productSelect, options: PRODUCTS });

  const updateCart = () => {
    let totalPrice = 0;
    let totalQuantity = 0;
    let prevTotal = 0;
    let discountRate = 0;

    Array.from(cartItemsContainer.children).forEach((cartItem) => {
      const product = findProduct({
        products: PRODUCTS,
        selectedId: cartItem.id,
      });
      const quantity = parseInt(getCartItemText({ cartItem, index: 1 }));
      const total = product.price * quantity;
      const discount = getDiscountRateById({ productId: product.id, quantity });

      totalQuantity += quantity;
      prevTotal += total;
      totalPrice += total * (1 - discount);
    });

    discountRate = calculateDiscountRate({
      quantity: totalQuantity,
      prevTotal,
      totalPrice,
    });

    if (discountRate === MAX_DISCOUNT_RATE) {
      totalPrice = prevTotal * (1 - MAX_DISCOUNT_RATE);
    }

    setAttribute({
      element: cartTotalContainer,
      attributes: {
        textContent: `총액: ${Math.round(totalPrice)}원`,
      },
    });

    if (discountRate > 0) {
      const discountSpan = createDOMElement({
        name: "span",
        options: {
          className: "text-green-500 ml-2",
          textContent: `(${(discountRate * 100).toFixed(1)}% 할인 적용)`,
        },
      });

      appendChildElement({
        parent: cartTotalContainer,
        children: [discountSpan],
      });
    }
  };

  addButton.onclick = () => {
    const selectedValue = productSelect.value;
    let selectedProduct;

    PRODUCTS.forEach((product) => {
      if (product.id === selectedValue) {
        selectedProduct = product;
      }
    });

    if (selectedProduct) {
      const cartItem = document.getElementById(selectedProduct.id);
      if (cartItem) {
        const quantity = parseInt(getCartItemText({ cartItem, index: 1 })) + 1;
        setAttribute({
          element: cartItem.querySelector("span"),
          attributes: {
            textContent: `${selectedProduct.name} - ${selectedProduct.price}원 x ${quantity}`,
          },
        });
      } else {
        const divContainer = createDOMElement({
          name: "div",
          options: {
            id: selectedProduct.id,
            className: "flex justify-between items-center mb-2",
          },
        });
        appendChildElement({
          parent: cartItemsContainer,
          children: [divContainer],
        });

        const spanContainer = createDOMElement({
          name: "span",
          options: {
            textContent: `${selectedProduct.name} - ${selectedProduct.price}원 x 1`,
          },
        });
        const buttonContainer = createDOMElement({
          name: "div",
        });
        appendChildElement({
          parent: divContainer,
          children: [spanContainer, buttonContainer],
        });

        const decreaseButton = createDOMElement({
          name: "button",
          options: {
            className:
              "quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1",
            textContent: "-",
            dataset: {
              productId: selectedProduct.id,
              change: -1,
            },
          },
        });
        const increaseButton = createDOMElement({
          name: "button",
          options: {
            className:
              "quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1",
            textContent: "+",
            dataset: {
              productId: selectedProduct.id,
              change: 1,
            },
          },
        });
        const removeButton = createDOMElement({
          name: "button",
          options: {
            className: "remove-item bg-red-500 text-white px-2 py-1 rounded",
            textContent: "삭제",
            dataset: {
              productId: selectedProduct.id,
            },
          },
        });
        appendChildElement({
          parent: buttonContainer,
          children: [decreaseButton, increaseButton, removeButton],
        });
      }
      updateCart();
    }
  };

  cartItemsContainer.onclick = (event) => {
    const target = event.target;

    if (
      target.classList.contains("remove-item") ||
      target.classList.contains("quantity-change")
    ) {
      const productId = target.dataset.productId;
      const cartItem = document.getElementById(productId);

      if (target.classList.contains("quantity-change")) {
        const change = parseInt(target.dataset.change);
        const quantity =
          parseInt(getCartItemText({ cartItem, index: 1 })) + change;

        if (quantity > 0) {
          const cartItemText = getCartItemText({ cartItem, index: 0 });
          setAttribute({
            element: cartItem.querySelector("span"),
            attributes: {
              textContent: `${cartItemText} x ${quantity}`,
            },
          });
        } else {
          cartItem.remove();
        }
      } else if (target.classList.contains("remove-item")) {
        cartItem.remove();
      }

      updateCart();
    }
  };
}

main();
