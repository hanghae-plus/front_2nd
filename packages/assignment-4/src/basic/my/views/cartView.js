import { createSelectedItemElement, createTotalPriceElement } from '../template/cartTemplate.js';

function renderSelectedItemView({ item, quantity }) {
  const cartItemsElement = document.getElementById('cart-items');
  cartItemsElement.children;

  createSelectedItemElement({ ...item, quantity });
}

function renderTotalPriceView() {
  return createTotalPriceElement();
}

export function renderCartView() {}

<div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
  <h1 className="text-2xl font-bold mb-4">장바구니</h1>
  <div id="cart-items">
    <div id="p3" className="flex justify-between items-center mb-2">
      <span>상품3 - 30000원 x 133</span>
      <div>
        <button
          className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
          data-product-id="p3"
          data-change="-1"
        >
          -
        </button>
        <button
          className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
          data-product-id="p3"
          data-change="1"
        >
          +
        </button>
        <button className="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="p3">
          삭제
        </button>
      </div>
    </div>
  </div>
  <div id="cart-total" className="text-xl font-bold my-4">
    총액: 3192000원<span className="text-green-500 ml-2">(20.0% 할인 적용)</span>
  </div>
  <select id="product-select" className="border rounded p-2 mr-2">
    <option value="p1">상품1 - 10000원</option>
    <option value="p2">상품2 - 20000원</option>
    <option value="p3">상품3 - 30000원</option>
  </select>
  <button id="add-to-cart" className="bg-blue-500 text-white px-4 py-2 rounded">
    추가
  </button>
</div>;
