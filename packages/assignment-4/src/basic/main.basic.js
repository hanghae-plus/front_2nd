let cartState = {
  cart: {},
  total: 0,
  discountRatio: 0
};

const PRICES = [
  { id: "p1", name: "상품1", price: 10000 },
  { id: "p2", name: "상품2", price: 20000 },
  { id: "p3", name: "상품3", price: 30000 },
];

const updateCartState = () => {
  const { total, totalQuantity, totalCount } = calculateTotals();
  const discountRatio = calculateDiscountRatio(total, totalCount, totalQuantity);

  cartState.total = Math.round(total);
  cartState.discountRatio = discountRatio;

  renderCartTotal();
};

const calculateTotals = () => {
  const result = Object.entries(cartState.cart).reduce((acc, [id, quantity]) => {
    const { price } = PRICES.find(item => item.id === id);
    const itemTotal = price * quantity;
    const discount = getDiscount(quantity, id);

    return {
      total: acc.total + itemTotal * (1 - discount),
      totalQuantity: acc.totalQuantity + quantity,
      totalCount: acc.totalCount + itemTotal
    };
  }, { total: 0, totalQuantity: 0, totalCount: 0 });

  if (result.totalQuantity >= 30) {
    result.total = Math.min(result.total, result.totalCount * 0.75);
  }

  return result;
};

const calculateDiscountRatio = (total, totalCount) => {
  const discountRatio = (totalCount - total) / totalCount;
  return Number((discountRatio * 100).toFixed(1)) / 100;
};

const getDiscount = (quantity, itemId) => {
  if (quantity >= 10) {
    const discounts = { p1: 0.1, p2: 0.15, p3: 0.2 };
    return discounts[itemId] || 0;
  }
  return 0;
};

const renderCartItems = () => {
  const cartItemsElement = document.getElementById("cart-items");
  cartItemsElement.innerHTML = '';

  Object.entries(cartState.cart).forEach(([id, quantity]) => {
    const item = PRICES.find(price => price.id === id);
    const itemElement = document.createElement('div');
    itemElement.id = id;
    itemElement.innerHTML = `
      <div id="product-id-${id}" class="flex justify-between items-center mb-2">
        <span>${item.name} - ${item.price}원 x ${quantity}</span>
        <div>
          <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${id}" data-change="-1">-</button>
          <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${id}" data-change="1">+</button>
          <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${id}">삭제</button>
        </div>
      </div>
    `;
    cartItemsElement.appendChild(itemElement);
  });
};

const renderCartTotal = () => {
  const cartTotalElement = document.getElementById("cart-total");
  cartTotalElement.textContent = `총액: ${cartState.total}원`;
  if (cartState.discountRatio > 0) {
    cartTotalElement.innerHTML += `<span class="text-green-500 ml-2">(${(cartState.discountRatio * 100).toFixed(1)}% 할인 적용)</span>`;
  }
};

// 이벤트 핸들러
const handleCartItemClick = (event) => {
  const { target } = event;
  const isQuantityChange = target.classList.contains("quantity-change");
  const isRemoveItem = target.classList.contains("remove-item");

  if (!isQuantityChange && !isRemoveItem) return;

  const productId = target.dataset.productId;

  if (isQuantityChange) {
    const change = parseInt(target.dataset.change);
    cartState.cart[productId] = (cartState.cart[productId] || 0) + change;
    if (cartState.cart[productId] <= 0) {
      delete cartState.cart[productId];
    }
  }

  if (isRemoveItem) {
    delete cartState.cart[productId];
  }

  renderCartItems();
  updateCartState();
};

const handleAddToCart = () => {
  const selectElement = document.getElementById("product-select");
  const selectedId = selectElement.value;
  cartState.cart[selectedId] = (cartState.cart[selectedId] || 0) + 1;
  renderCartItems();
  updateCartState();
};


// main 함수
const main = () => {
  const appElement = document.getElementById("app");

  appElement.innerHTML = `
    <div class="bg-gray-100 p-8">
      <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 class="text-2xl font-bold mb-4">장바구니</h1>
        <div id="cart-items"></div>
        <div id="cart-total" class="text-xl font-bold my-4"></div>
        <select id="product-select" class="border rounded p-2 mr-2">
          ${PRICES.map(({ id, name, price }) => `
            <option value="${id}">${name} - ${price}원</option>
          `).join('')}
        </select>
        <button id="add-to-cart" class="bg-blue-500 text-white px-4 py-2 rounded">추가</button>
      </div>
    </div>
  `;

  // 이벤트 핸들러 등록
  document.getElementById("cart-items").onclick = handleCartItemClick;
  document.getElementById("add-to-cart").onclick = handleAddToCart;

  renderCartItems();
  updateCartState();
};

main();