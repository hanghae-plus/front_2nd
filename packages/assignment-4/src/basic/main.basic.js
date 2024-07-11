const PRICES = [
  { id: "p1", n: "상품1", p: 10000 },
  { id: "p2", n: "상품2", p: 20000 },
  { id: "p3", n: "상품3", p: 30000 },
];

function getQuantity(element){
  return parseInt(element.querySelector("span").textContent.split("x ")[1])
}

function main() {
  const appElement = document.getElementById("app");
  const wrapperElement = document.createElement("div");
  const contentElement = getContentElement();

  wrapperElement.className = "bg-gray-100 p-8";
  wrapperElement.appendChild(contentElement);
  appElement.appendChild(wrapperElement);
}

function getContentElement() {
  const contents = document.createElement("div");
  contents.className =
    "max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8";

  const titleElement = getTitleElement();
  const cartItemElement = getCartItemElement();
  const cartTotalElement = getCartTotalElement();
  const selectElement = getCartItemSelector();
  const addButtonElement = getAddButtonElement(selectElement, cartItemElement);

  [
    titleElement,
    cartItemElement,
    cartTotalElement,
    selectElement,
    addButtonElement,
  ].forEach((el) => contents.appendChild(el));

  return contents;
}

const getTitleElement = function () {
  const title = document.createElement("h1");
  title.className = "text-2xl font-bold mb-4";
  title.textContent = "장바구니";

  return title;
};

const getCartItemElement = function () {
  const cartItem = document.createElement("div");
  cartItem.id = "cart-items";
  cartItem.onclick = function (event) {
    const target = event.target;
    const classList = Array.from(target.classList);
    const isQuantityChange = classList.includes("quantity-change");
    const isRemoveItem = classList.includes("remove-item");

    if (isQuantityChange || isRemoveItem) {
      const productId = target.dataset.productId;
      const item = document.getElementById(productId);
      const itemSpan = item.querySelector("span");

      if (isQuantityChange) {
        const change = parseInt(target.dataset.change); // 1 or -1
        const quantity = getQuantity(itemSpan) + change;

        if (quantity > 0) {
          itemSpan.textContent =
            itemSpan.textContent.split("x ")[0] + "x " + quantity;
        } else {
          item.remove();
        }
      }

      if (isRemoveItem) {
        item.remove();
      }

      updateCart();
    }
  };
  return cartItem;
};

const getCartTotalElement = function () {
  const cartTotal = document.createElement("div");
  cartTotal.id = "cart-total";
  cartTotal.className = "text-xl font-bold my-4";

  return cartTotal;
};

const getCartItemSelector = function () {
  const selector = document.createElement("select");
  selector.id = "product-select";
  selector.className = "border rounded p-2 mr-2";

  for (let item = 0; item < PRICES.length; item++) {
    const option = document.createElement("option");
    option.value = PRICES[item].id;
    option.textContent = `${PRICES[item].n} - ${PRICES[item].p}원`;
    selector.appendChild(option);
  }

  return selector;
};

const getAddButtonElement = function (select, cartItem) {
  const addButton = document.createElement("button");
  addButton.id = "add-to-cart";
  addButton.className = "bg-blue-500 text-white px-4 py-2 rounded";
  addButton.textContent = "추가";
  addButton.onclick = function () {
    const selectedId = select.value;
    const newId = PRICES.filter(price => price.id === selectedId)[0]

    if (newId) {
      const exitedId = document.getElementById(newId.id);
      if (exitedId) {
        const quantity = getQuantity(exitedId) + 1;
        exitedId.querySelector("span").textContent = `${newId.n} - ${newId.p}원 x ${quantity}`;
      }
      cartItem.innerHTML += `<div id=${newId.id}>
    <div id="product-id-${newId.id}" class="flex justify-between items-center mb-2">
      <span>상품 ${newId.n} - ${newId.p} 원 x 1</span>
      <div>
        <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="product-id-${newId.id}" data-change="-1">-</button>
        <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="product-id-${newId.id}" data-change="1">+</button>
        <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="product-id-${newId.id}">삭제</button>
      </div>
    </div>
  </div>`;
      updateCart();
      }
    };
  return addButton;
};

function updateCart() {
  const cartItem = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  const items = cartItem.children;
  const {total, totalQuantity, totalCount} = getTotalPrice(items);

  const discountRatio = calculateDiscountRatio(total, totalCount, totalQuantity)
  cartTotal.textContent = "총액: " + Math.round(total) + "원";

  if (discountRatio > 0) {
    cartTotal.innerHTML = `<span class="text-green-500 ml-2">
        (${discountRatio}% 할인 적용)
    </span>`;
  }
}

function getTotalPrice(items) {
  let total = 0;
  let totalQuantity = 0;
  let totalCount = 0;

  Array.from(items).forEach((item) => {
    const newItem = PRICES.filter(price => price.id === item.id)
    const quantity = getQuantity(item);
    const itemTotal = newItem[0].p * quantity;

    totalQuantity += quantity;
    totalCount += itemTotal;

    const discount = getDiscount(quantity, newItem)
    total += itemTotal * (1 - discount)
  })

  return {total, totalQuantity, totalCount}
}

function getDiscount(quantity, item){
  if (quantity >= 10) {
    switch(item.id){
      case "p1":
        return 0.1
      case "p2":
        return 0.15
      case "p3":
        return 0.2
      default:
        return 0
    }
  }
  return 0
}

function calculateDiscountRatio(total, totalCount, totalQuantity){
  const bulkDiscount = total * 0.25;
  const individualDiscount = totalCount - total;

  const discountRatio = (totalCount - total) / totalCount;

  if (totalQuantity >= 30) {
    return bulkDiscount > individualDiscount ? 0.25 : discountRatio;
  }

  return discountRatio;
}

main();
