import { CartItem } from "./CartItem";
import {
  appendChildElement,
  appendSelectOptions,
  createDOMElement,
  setAttribute,
} from "./render";
import {
  calculateDiscount,
  calculateDiscountRate,
  calculateDiscountedTotal,
  findProduct,
  getQuantityByCartItem,
} from "./utils";

const PRODUCTS = [
  { id: "p1", name: "상품1", price: 10000 },
  { id: "p2", name: "상품2", price: 20000 },
  { id: "p3", name: "상품3", price: 30000 },
];

const main = () => {
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

  appendSelectOptions({ select: productSelect, options: PRODUCTS });

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

  const updateCart = () => {
    let originalTotal = 0;
    let totalQuantity = 0;
    let prevTotal = 0;

    Array.from(cartItemsContainer.children).forEach((cartItem) => {
      const product = findProduct({
        product: PRODUCTS,
        selectedId: cartItem.id,
      });
      const quantity = getQuantityByCartItem(cartItem);
      const discount = calculateDiscount({ quantity, productId: product.id });
      const discountedTotal = calculateDiscountedTotal({
        price: product.price,
        quantity,
        discount,
      });

      totalQuantity += quantity;
      prevTotal += product.price * quantity;
      originalTotal += discountedTotal;
    });

    const discountRate = calculateDiscountRate({
      totalQuantity,
      prevTotal,
      originalTotal,
    });

    setAttribute({
      element: cartTotalContainer,
      attributes: {
        textContent: `총액: ${Math.round(originalTotal)}원`,
      },
    });

    if (discountRate > 0) {
      originalTotal = prevTotal * (1 - discountRate);

      setAttribute({
        element: cartTotalContainer,
        attributes: {
          textContent: `총액: ${Math.round(originalTotal)}원`,
        },
      });

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
    const selectedProductId = productSelect.value;
    const selectedProduct = findProduct({
      product: PRODUCTS,
      selectedId: selectedProductId,
    });

    const existingCartItem = document.getElementById(selectedProduct.id);
    if (existingCartItem) {
      const cartItemSpan = existingCartItem.querySelector("span");
      const quantity = getQuantityByCartItem(existingCartItem) + 1;

      setAttribute({
        element: cartItemSpan,
        attributes: {
          textContent: `${selectedProduct.name} - ${selectedProduct.price}원 x ${quantity}`,
        },
      });
    } else {
      const cartItem = CartItem({ selectedProduct });
      appendChildElement({
        parent: cartItemsContainer,
        children: [cartItem],
      });
    }
    updateCart();
  };

  cartItemsContainer.onclick = (event) => {
    const target = event.target;
    const productId = target.dataset.productId;
    const cartItem = document.getElementById(productId);

    if (target.classList.contains("quantity-change")) {
      const cartItemSpan = cartItem.querySelector("span");
      const change = parseInt(target.dataset.change);

      const changedQuantity = getQuantityByCartItem(cartItem) + change;

      if (changedQuantity > 0) {
        setAttribute({
          element: cartItemSpan,
          attributes: {
            textContent: `${
              cartItemSpan.textContent.split("x ")[0]
            }x ${changedQuantity}`,
          },
        });
      } else {
        cartItem.remove();
      }
    } else if (target.classList.contains("remove-item")) {
      cartItem.remove();
    }

    updateCart();
  };
};

main();
