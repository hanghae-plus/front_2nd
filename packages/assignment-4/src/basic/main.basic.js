const PRICES = [
  {id: "p1", n: "상품1", p: 10000},
  {id: "p2", n: "상품2", p: 20000},
  {id: "p3", n: "상품3", p: 30000},
];

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
  const addButtonElement = getAddButtonElement();

  contents.appendChild(titleElement);
  contents.appendChild(cartItemElement);
  contents.appendChild(cartTotalElement);
  contents.appendChild(selectElement);
  contents.appendChild(addButtonElement);

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

  const handleClickCartItem = function (event) {
    const target = event.target;
    const classList = Array.from(target.classList);
    const isQuantityChange = classList.includes("quantity-change");
    const isRemoveItem = classList.includes("remove-item");

    if (isQuantityChange|| isRemoveItem) {
      const productId = target.dataset.productId;
      const item = document.getElementById(productId);
      const itemSpan = item.querySelector("span")

      if (isQuantityChange) {
        const change = parseInt(target.dataset.change); // 1 or -1
        const quantity = parseInt(itemSpan.textContent.split("x ")[1]) + change;

        if (quantity > 0) {
          itemSpan.textContent = itemSpan.textContent.split("x ")[0] + "x " + quantity;
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
  cartItem.onclick = handleClickCartItem;
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

const getAddButtonElement = function () {
  const addButton = document.createElement("button");
  addButton.id = "add-to-cart";
  addButton.className = "bg-blue-500 text-white px-4 py-2 rounded";
  addButton.textContent = "추가";

  const select = document.createElement('select');

  const handleClickAddButton = function () {
    let selectedId = select.value;
    let id;

    for (var k = 0; k < PRICES.length; k++) {
      if (PRICES[k].id === selectedId) {
        id = PRICES[k];
        break;
      }
    }

    if (id) {
      const e = document.getElementById(id.id);
      if (e) {
        var quantity = parseInt(e.querySelector("span").textContent.split("x ")[1]) + 1;
        e.querySelector("span").textContent = id.n + " - " + id.p + "원 x " + quantity;
      } else {
        return `<div id="container">
        <div id="product-id-1" class="flex justify-between items-center mb-2">
            <span>상품 ${id.n} - ${id.p} 원 x 1</span>
            <div>
                <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="product-id-1" data-change="-1">-</button>
                <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="product-id-1" data-change="1">+</button>
                <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="product-id-1">삭제</button>
            </div>
        </div>
    </div>
        `
      }
      updateCart();
    }
  };
  addButton.onclick = handleClickAddButton;

  return addButton;
};

function updateCart() {
  const cartItem = getCartItemElement();
  const cartTotal = getCartTotalElement();

  let total = 0;
  let totalQuantity = 0;
  const items = cartItem.children;
  let totalCount = 0;

  for (var m = 0; m < items.length; m++) {
    let item;

    for (var n = 0; n < PRICES.length; n++) {
      if (PRICES[n].id === items[m].id) {
        item = PRICES[n];
        break;
      }
    }

    const quantity = parseInt(items[m].querySelector("span").textContent.split("x ")[1]);
    const itemTotal = item.p * quantity;
    let discount = 0;

    totalQuantity += quantity;
    totalCount += itemTotal;
    if (quantity >= 10) {
      if (item.id === "p1") discount = 0.1;
      else if (item.id === "p2") discount = 0.15;
      else if (item.id === "p3") discount = 0.2;
    }
    total += itemTotal * (1 - discount);
  }

  let discountRatio = 0;
  if (totalQuantity >= 30) {
    const bulkDiscount = total * 0.25;
    const individualDiscount = totalCount - total;
    if (bulkDiscount > individualDiscount) {
      total = totalCount * 0.75;
      discountRatio = 0.25;
    } else {
      discountRatio = (totalCount - total) / totalCount;
    }
  } else {
    discountRatio = (totalCount - total) / totalCount;
  }

  cartTotal.textContent = "총액: " + Math.round(total) + "원";

  if (discountRatio > 0) {
    cartTotal.appendChild(`<span className="text-green-500 ml-2">
        (${discountRatio}% 할인 적용)
    </span>`);
  }
}

main();
