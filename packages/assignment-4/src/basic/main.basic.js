// 상수 정의 (윤석의 코드 스타일)
const PRODUCTS = [
  { id: "p1", name: "상품1", price: 10000 },
  { id: "p2", name: "상품2", price: 20000 },
  { id: "p3", name: "상품3", price: 30000 }
];

const DISCOUNT_THRESHOLDS = {
  QUANTITY: 10,
  BULK: 30
};

const DISCOUNT_RATES = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
  BULK: 0.25
};

const CLASSES = {
  WRAPPER: "bg-gray-100 p-8",
  CONTAINER:
    "max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8",
  TITLE: "text-2xl font-bold mb-4",
  TOTAL: "text-xl font-bold my-4",
  SELECT: "border rounded p-2 mr-2",
  BUTTON: "bg-blue-500 text-white px-4 py-2 rounded",
  CART_ITEM: "flex justify-between items-center mb-2",
  QUANTITY_BUTTON:
    "quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1",
  REMOVE_BUTTON: "remove-item bg-red-500 text-white px-2 py-1 rounded",
  DISCOUNT_SPAN: "text-green-500 ml-2"
};

// 유틸리티 함수 (수빈의 코드 스타일)
const createElement = (tag, attributes = {}, children = []) => {
  const element = document.createElement(tag);
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === "className") element.className = value;
    else if (key === "textContent") element.textContent = value;
    else if (key.startsWith("on"))
      element.addEventListener(key.slice(2).toLowerCase(), value);
    else if (key === "dataset")
      Object.entries(value).forEach(
        ([dataKey, dataValue]) => (element.dataset[dataKey] = dataValue)
      );
    else element.setAttribute(key, value);
  });
  children.forEach(child =>
    element.appendChild(
      typeof child === "string" ? document.createTextNode(child) : child
    )
  );
  return element;
};

const getQuantity = element =>
  parseInt(element.querySelector("span").textContent.split("x ")[1]);

// 메인 함수들 (윤석과 수빈의 코드 스타일 결합)
const createAppElements = () => {
  const fragment = document.createDocumentFragment(); // 수빈의 코드: fragment 사용
  const wrapper = createElement("div", { className: CLASSES.WRAPPER });
  const container = createElement("div", { className: CLASSES.CONTAINER });
  const title = createElement("h1", {
    className: CLASSES.TITLE,
    textContent: "장바구니"
  });
  const cartItems = createElement("div", { id: "cart-items" });
  const cartTotal = createElement("div", {
    id: "cart-total",
    className: CLASSES.TOTAL
  });
  const productSelect = createElement(
    "select",
    { id: "product-select", className: CLASSES.SELECT },
    PRODUCTS.map(product =>
      createElement("option", {
        value: product.id,
        textContent: `${product.name} - ${product.price}원`
      })
    )
  );
  const addButton = createElement("button", {
    id: "add-to-cart",
    className: CLASSES.BUTTON,
    textContent: "추가"
  });

  container.append(title, cartItems, cartTotal, productSelect, addButton);
  wrapper.appendChild(container);
  fragment.appendChild(wrapper); // 수빈의 코드: fragment에 추가

  document.getElementById("app").appendChild(fragment); // 수빈의 코드: fragment를 DOM에 추가

  return { cartItems, cartTotal, productSelect, addButton };
};

const updateCart = () => {
  const items = Array.from(document.querySelectorAll("#cart-items > div"));
  const { total, totalQuantity, totalBeforeDiscount } = items.reduce(
    (acc, item) => {
      const product = PRODUCTS.find(p => p.id === item.id);
      const quantity = getQuantity(item);
      const itemTotal = product.price * quantity;
      const discount =
        quantity >= DISCOUNT_THRESHOLDS.QUANTITY
          ? DISCOUNT_RATES[product.id]
          : 0;

      acc.totalQuantity += quantity;
      acc.totalBeforeDiscount += itemTotal;
      acc.total += itemTotal * (1 - discount);
      return acc;
    },
    { total: 0, totalQuantity: 0, totalBeforeDiscount: 0 }
  );

  const bulkDiscount = total * DISCOUNT_RATES.BULK;
  const individualDiscount = totalBeforeDiscount - total;
  const finalTotal =
    totalQuantity >= DISCOUNT_THRESHOLDS.BULK &&
    bulkDiscount > individualDiscount
      ? totalBeforeDiscount * (1 - DISCOUNT_RATES.BULK)
      : total;
  const discountRate = (totalBeforeDiscount - finalTotal) / totalBeforeDiscount;

  const cartTotal = document.getElementById("cart-total");
  cartTotal.textContent = `총액: ${Math.round(finalTotal)}원`;
  if (discountRate > 0) {
    cartTotal.appendChild(
      createElement("span", {
        className: CLASSES.DISCOUNT_SPAN,
        textContent: `(${(discountRate * 100).toFixed(1)}% 할인 적용)`
      })
    );
  }
};

const createCartItem = product => {
  return createElement(
    "div",
    { id: product.id, className: CLASSES.CART_ITEM },
    [
      createElement("span", {
        textContent: `${product.name} - ${product.price}원 x 1`
      }),
      createElement("div", {}, [
        createElement("button", {
          className: CLASSES.QUANTITY_BUTTON,
          textContent: "-",
          dataset: { productId: product.id, change: "-1" }
        }),
        createElement("button", {
          className: CLASSES.QUANTITY_BUTTON,
          textContent: "+",
          dataset: { productId: product.id, change: "1" }
        }),
        createElement("button", {
          className: CLASSES.REMOVE_BUTTON,
          textContent: "삭제",
          dataset: { productId: product.id }
        })
      ])
    ]
  );
};

// 메인 함수 (지원의 코드 구조와 유사)
function main() {
  const { cartItems, productSelect, addButton } = createAppElements();

  addButton.onclick = () => {
    const selectedProduct = PRODUCTS.find(p => p.id === productSelect.value);
    if (selectedProduct) {
      let existingItem = document.getElementById(selectedProduct.id);
      if (existingItem) {
        const quantitySpan = existingItem.querySelector("span");
        const quantity = getQuantity(existingItem) + 1;
        quantitySpan.textContent = `${selectedProduct.name} - ${selectedProduct.price}원 x ${quantity}`;
      } else {
        cartItems.appendChild(createCartItem(selectedProduct));
      }
      updateCart();
    }
  };

  cartItems.onclick = event => {
    const target = event.target;
    if (
      target.classList.contains("quantity-change") ||
      target.classList.contains("remove-item")
    ) {
      const productId = target.dataset.productId;
      const item = document.getElementById(productId);
      if (target.classList.contains("quantity-change")) {
        const change = parseInt(target.dataset.change);
        const quantitySpan = item.querySelector("span");
        const quantity = getQuantity(item) + change;
        if (quantity > 0) {
          quantitySpan.textContent =
            quantitySpan.textContent.split("x ")[0] + `x ${quantity}`;
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
