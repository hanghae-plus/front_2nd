export const ProductOption = ({ id, name, price }) =>
  `<option value="${id}">${name} - ${price}원</option>`;

export const MainLayout = ({ items }) => `<div class="bg-gray-100 p-8">
    <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
      <h1 class="text-2xl font-bold mb-4">장바구니</h1>
        <div id="cart-items"></div>
        <div id="cart-total" class="text-xl font-bold my-4"></div>
        <select id="product-select" class="border rounded p-2 mr-2">
        ${items.map((product) => ProductOption(product)).join('')}
      </select>
        <button id="add-to-cart" class="bg-blue-500 text-white px-4 py-2 rounded">추가</button>
    </div>
  </div>`;

export const CartItem = ({
  product,
  quantity,
}) => `<div class="flex justify-between items-center mb-2">
    <span>${product.name} - ${product.price}원 x ${quantity}</span>
    <div>
      <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${product.id}" data-change="-1">-</button>
      <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${product.id}" data-change="1">+</button>
      <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${product.id}">삭제</button>
    </div>
  </div>`;

export const CartTotal = ({ total, discountRate }) => `
  <div id="cart-total" class="text-xl font-bold my-4">
    총액: ${total}원
    ${
      discountRate > 0
        ? `<span class="text-green-500 ml-2">(${(discountRate * 100).toFixed(
            1
          )}% 할인 적용)</span>`
        : ''
    }
  </div>`;
