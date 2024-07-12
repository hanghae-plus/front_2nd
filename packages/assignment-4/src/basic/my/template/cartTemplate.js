export function createMainViewElement() {
  return `
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
      <h1 id='title' className="text-2xl font-bold mb-4">장바구니</h1>
      <div id="cart-items"></div>
      <div id="cart-total" className="text-xl font-bold my-4"></div>
      <select id="product-select" className="border rounded p-2 mr-2"></select>
      <button id="add-to-cart" className="bg-blue-500 text-white px-4 py-2 rounded">추가</button>
    </div>
  `;
}

export function createItemOptionElement({ id, name, price }) {
  return `<option value="${id}">${name} - ${price}원</option>`;
}

export function createSelectedItemElement({ id, name, price, quantity }) {
  return `<div id="${id}" className="flex justify-between items-center mb-2">
    <span>${name} - ${price}원 x ${quantity}</span>
    <div>
      <button
        className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
        data-product-id="${id}"
        data-change="-1"
      >
        -
      </button>
      <button
        className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
        data-product-id="${id}"
        data-change="1"
      >
        +
      </button>
      <button className="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${id}">
        삭제
      </button>
    </div>
  </div>`;
}

export function createTotalPriceElement({ totalPrice, discountRatio }) {
  if (discountRatio)
    return `총액: ${totalPrice}<span className="text-green-500 ml-2">(${discountRatio}% 할인 적용)</span>`;
  return `총액: ${totalPrice}`;
}
