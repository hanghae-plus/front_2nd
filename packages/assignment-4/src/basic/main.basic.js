function main() {
  // #region [상수] 가격 및 할인 정보
  const PRODUCT_LIST = [
    { id: "p1", name: "상품1", price: 10000 },
    { id: "p2", name: "상품2", price: 20000 },
    { id: "p3", name: "상품3", price: 30000 },
  ];

  // 할인이 적용되는 상품의 최소 갯수 설정
  const PRODUCT_DISCOUNT_RATE_MAPPING = {
    p1: 0.1,
    p2: 0.15,
    p3: 0.2,
  };
  const DISCOUNT_QUANTITY_THRESHOLD = 10;
  const DISCOUNT_QUANTITY_THRESHOLD_BULK = 30;
  const DISCOUNT_RATE_BULK = 0.25;
  // #endregion

  // #region DOM 조작 함수
  function addOption(obj, key, value) {
    // option값을 재귀적으로 처리하기 위한 함수
    if (typeof value === "object" && value !== null) {
      if (!obj[key]) {
        obj[key] = {};
      }
      for (const subKey in value) {
        if (Object.prototype.hasOwnProperty.call(value, subKey)) {
          addOption(obj[key], subKey, value[subKey]);
        }
      }
    } else {
      obj[key] = value;
    }
  }

  const createDOMElement = (name, options) => {
    const newElement = document.createElement(name);
    // options의 value가 object인 경우 재귀적으로 처리
    Object.keys(options).forEach((option) => {
      addOption(newElement, option, options[option]);
    });

    return newElement;
  };

  const appendChildElement = (parent, ...children) => {
    children.forEach((child) => {
      parent.appendChild(child);
    });
  };

  const addSelectOptions = (parent, options) => {
    Object.keys(options).forEach((option) => {
      const newOption = createDOMElement("option", {
        value: options[option].id,
        textContent: `${options[option].name} - ${options[option].price}원`,
      });
      appendChildElement(parent, newOption);
    });
  };
  // #endregion

  // #region DOM Element 생성
  const app = document.getElementById("app");

  const container = createDOMElement("div", { className: "bg-gray-100 p-8" });
  appendChildElement(app, container);

  const cartContainer = createDOMElement("div", {
    className:
      "max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8",
  });
  appendChildElement(container, cartContainer);

  const title = createDOMElement("h1", {
    className: "text-2xl font-bold mb-4",
    textContent: "장바구니",
  });

  const cartItemListContainer = createDOMElement("div", { id: "cart-items" });

  const cartTotalContainer = createDOMElement("div", {
    id: "cart-total",
    className: "text-xl font-bold my-4",
  });

  const addButton = createDOMElement("button", {
    id: "add-to-cart",
    className: "bg-blue-500 text-white px-4 py-2 rounded",
    textContent: "추가",
  });

  const productSelect = createDOMElement("select", {
    id: "product-select",
    className: "border rounded p-2 mr-2",
  });

  appendChildElement(
    cartContainer,
    title,
    cartItemListContainer,
    cartTotalContainer,
    productSelect,
    addButton,
  );

  addSelectOptions(productSelect, PRODUCT_LIST);
  // #endregion

  const findProductById = (selectedProductId) => {
    return PRODUCT_LIST.find(({ id }) => id === selectedProductId);
  };

  const getQuantity = (item) => {
    return parseInt(item.querySelector("span").textContent.split("x ")[1]);
  };

  const getItemTotalAmount = (item, quantity) => {
    return item.price * quantity;
  };

  const getItemTotalAmountAfterDiscount = (quantity, itemTotalAmount, item) => {
    let disc = 0;

    // 할인이 적용되는 갯수만큼 구입한 경우 할인율 적용
    if (quantity >= DISCOUNT_QUANTITY_THRESHOLD) {
      disc = PRODUCT_DISCOUNT_RATE_MAPPING[item.id] || 0;
    }
    return itemTotalAmount * (1 - disc);
  };

  const getTotalDiscountRate = (
    totalQuantity,
    totalAmountBeforeDiscount,
    totalAmount,
  ) => {
    let totalDiscountRate = 0;

    if (totalAmountBeforeDiscount === 0) {
      return totalDiscountRate;
    }

    if (totalQuantity >= DISCOUNT_QUANTITY_THRESHOLD_BULK) {
      const bulkDiscount = totalAmount * DISCOUNT_RATE_BULK;
      const individualDiscount = totalAmountBeforeDiscount - totalAmount;
      if (bulkDiscount > individualDiscount) {
        totalDiscountRate = DISCOUNT_RATE_BULK;
      } else {
        totalDiscountRate =
          (totalAmountBeforeDiscount - totalAmount) / totalAmountBeforeDiscount;
      }
    } else {
      totalDiscountRate =
        (totalAmountBeforeDiscount - totalAmount) / totalAmountBeforeDiscount;
    }

    return totalDiscountRate;
  };

  function updateCart() {
    let totalAmount = 0;
    let totalQuantity = 0;
    let totalAmountBeforeDiscount = 0;

    const items = cartItemListContainer.children;

    for (let m = 0; m < items.length; m++) {
      const item = findProductById(items[m].id);
      const quantity = getQuantity(items[m]);
      const itemTotalAmount = getItemTotalAmount(item, quantity);
      const itemTotalAmountAfterDiscount = getItemTotalAmountAfterDiscount(
        quantity,
        itemTotalAmount,
        item,
      );

      totalQuantity += quantity;
      totalAmountBeforeDiscount += itemTotalAmount;
      totalAmount += itemTotalAmountAfterDiscount;
    }

    // bulk discount가 적용되는 경우, total amount를 재계산

    const totalDiscountRate = getTotalDiscountRate(
      totalQuantity,
      totalAmountBeforeDiscount,
      totalAmount,
    );

    totalAmount = totalAmountBeforeDiscount * (1 - totalDiscountRate);

    cartTotalContainer.textContent = "총액: " + Math.round(totalAmount) + "원";
    if (totalDiscountRate > 0) {
      const dspan = createDOMElement("span", {
        className: "text-green-500 ml-2",
        textContent: `(${(totalDiscountRate * 100).toFixed(1)}% 할인 적용)`,
      });
      cartTotalContainer.appendChild(dspan);
    }
  }

  addButton.onclick = () => {
    const selectedProductId = productSelect.value;
    const selectedProduct = findProductById(selectedProductId);

    if (selectedProduct) {
      const existingCartItem = document.getElementById(selectedProduct.id);

      if (existingCartItem) {
        updateExistingCartItem(existingCartItem, selectedProduct);
      } else {
        const cartItem = createCartItem(selectedProduct);
        cartItemListContainer.appendChild(cartItem);
      }
      updateCart();
    }
  };

  function updateExistingCartItem(cartItem, product) {
    const quantitySpan = cartItem.querySelector("span");
    const quantity = parseInt(quantitySpan.textContent.split("x ")[1]) + 1;
    quantitySpan.textContent = `${product.name} - ${product.price}원 x ${quantity}`;
  }

  function createCartItem(product) {
    const cartItem = createDOMElement("div", {
      id: product.id,
      className: "flex justify-between items-center mb-2",
    });

    const cartItemDescription = createDOMElement("span", {
      textContent: `${product.name} - ${product.price}원 x 1`,
    });

    const cartItemButtons = createDOMElement("div", {});

    const buttons = [
      { text: "-", change: "-1", class: "quantity-change" },
      { text: "+", change: "1", class: "quantity-change" },
      { text: "삭제", change: null, class: "remove-item" },
    ].map(({ text, change, class: className }) =>
      createDOMElement("button", {
        className: `${className} ${
          change ? "bg-blue-500" : "bg-red-500"
        } text-white px-2 py-1 rounded mr-1`,
        textContent: text,
        dataset: { productId: product.id, ...(change && { change }) },
      }),
    );

    cartItem.appendChild(cartItemDescription);
    cartItem.appendChild(cartItemButtons);
    buttons.forEach((button) => cartItemButtons.appendChild(button));

    return cartItem;
  }

  cartItemListContainer.onclick = (event) => {
    const target = event.target;
    if (
      target.classList.contains("quantity-change") ||
      target.classList.contains("remove-item")
    ) {
      const productId = target.dataset.productId;
      const item = document.getElementById(productId);
      if (target.classList.contains("quantity-change")) {
        const change = parseInt(target.dataset.change);
        const quantity =
          parseInt(item.querySelector("span").textContent.split("x ")[1]) +
          change;
        if (quantity > 0) {
          item.querySelector("span").textContent =
            item.querySelector("span").textContent.split("x ")[0] +
            "x " +
            quantity;
        } else {
          item.remove();
        }
      } else if (target.classList.contains("remove-item")) {
        item.remove();
      }
      updateCart();
    }
  };
}

main();
