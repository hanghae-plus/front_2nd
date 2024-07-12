export const itemList = [
  { id: 'p1', name: '상품1', price: 10000 },
  { id: 'p2', name: '상품2', price: 20000 },
  { id: 'p3', name: '상품3', price: 30000 },
];

export function ProductOption(product) {
  return `<option value="${product.id}">${product.name} - ${product.price}원</option>`;
}

export function MainLayout({ items }) {
  return `<div class="bg-gray-100 p-8">
    <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
      <h1 class="text-2xl font-bold mb-4">장바구니</h1>
      <div id="cart-items"></div>
      <div id="cart-total" class="text-xl font-bold my-4"></div>
      <select id="product-select" class="border rounded p-2 mr-2">
        ${items.map((item) => `<option value="${item.id}">${item.name} - ${item.price}원</option>`).join('')}
      </select>
      <button id="add-to-cart" class="bg-blue-500 text-white px-4 py-2 rounded">추가</button>
    </div>
  </div>`;
}

export function CartItem(item) {
  return `<div class="flex justify-between items-center mb-2">
    <span>${item.product.name} - ${item.product.price}원 x ${item.quantity}</span>
    <div>
      <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${item.product.id}" data-change="-1">-</button>
      <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${item.product.id}" data-change="1">+</button>
      <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${item.product.id}">삭제</button>
    </div>
  </div>`;
}

export function CartTotal({ total, discountRate }) {
  if (discountRate > 0) {
    return `<div>총액: ${total}원 (${(discountRate * 100).toFixed(1)}% 할인 적용)</div>`;
  } else {
    return `<div>총액: ${total}원</div>`;
  }
}
