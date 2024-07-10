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

  const handleClickAddButton = function () {
    var v = s.value;
    var i;
    for (var k = 0; k < PRICES.length; k++) {
      if (PRICES[k].id === v) {
        i = PRICES[k];
        break;
      }
    }
    if (i) {
      var e = document.getElementById(i.id);
      if (e) {
        var q =
          parseInt(e.querySelector("span").textContent.split("x ")[1]) + 1;
        e.querySelector("span").textContent = i.n + " - " + i.p + "원 x " + q;
      } else {
        var d = document.createElement("div");
        var sp = document.createElement("span");
        var bd = document.createElement("div");
        var mb = document.createElement("button");
        var pb = document.createElement("button");
        var rb = document.createElement("button");
        d.id = i.id;
        d.className = "flex justify-between items-center mb-2";
        sp.textContent = i.n + " - " + i.p + "원 x 1";

        mb.className =
          "quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1";
        mb.textContent = "-";
        mb.dataset.productId = i.id;
        mb.dataset.change = "-1";

        pb.className =
          "quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1";
        pb.textContent = "+";
        pb.dataset.productId = i.id;
        pb.dataset.change = "1";

        rb.className = "remove-item bg-red-500 text-white px-2 py-1 rounded";
        rb.textContent = "삭제";
        rb.dataset.productId = i.id;

        bd.appendChild(mb);
        bd.appendChild(pb);
        bd.appendChild(rb);

        d.appendChild(sp);
        d.appendChild(bd);

        ct.appendChild(d);
      }
      updateCart();
    }
  };
  addButton.onclick = handleClickAddButton;

  return addButton;
};

function updateCart() {
  const total = 0;
  const totalQuantity = 0;
  const items = cartItem.children;
  const tb = 0;

  for (var m = 0; m < items.length; m++) {
    var item;
    for (var n = 0; n < PRICES.length; n++) {
      if (PRICES[n].id === items[m].id) {
        item = PRICES[n];
        break;
      }
    }
    var quantity = parseInt(
      items[m].querySelector("span").textContent.split("x ")[1]
    );
    var itemTotal = item.p * quantity;
    var disc = 0;

    totalQuantity += quantity;
    tb += itemTotal;
    if (quantity >= 10) {
      if (item.id === "p1") disc = 0.1;
      else if (item.id === "p2") disc = 0.15;
      else if (item.id === "p3") disc = 0.2;
    }
    total += itemTotal * (1 - disc);
  }

  var dr = 0;
  if (totalQuantity >= 30) {
    var bulkDiscount = total * 0.25;
    var individualDiscount = tb - total;
    if (bulkDiscount > individualDiscount) {
      total = tb * 0.75;
      dr = 0.25;
    } else {
      dr = (tb - total) / tb;
    }
  } else {
    dr = (tb - total) / tb;
  }

  cartTotal.textContent = "총액: " + Math.round(total) + "원";
  if (dr > 0) {
    var dspan = document.createElement("span");
    dspan.className = "text-green-500 ml-2";
    dspan.textContent = "(" + (dr * 100).toFixed(1) + "% 할인 적용)";
    cartTotal.appendChild(dspan);
  }
}

main();
