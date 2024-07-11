import { CartItem } from './entities/cartItem.ts';
import { DiscountDetail, Product } from './types/type.ts';

export const getProductOptionLiteral = (product: Product) =>
  `<option value="${product.id}">${product.name + ' - ' + product.price + '원'}</option>`;

export const getMainLayoutLiteral = ({ items }: { items: Product[] }) => {
  let optionLiteral;
  if (items) {
    optionLiteral = items.map((item) => getProductOptionLiteral(item)).join('');
  }

  return `<div class="bg-gray-100 p-8">
    <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
      <h1 class="text-2xl font-bold mb-4">장바구니</h1>
        <div id="cart-items"></div>
        <div id="cart-total" class="text-xl font-bold my-4"></div>
        <select id="product-select" class="border rounded p-2 mr-2">
        ${optionLiteral}
      </select>
        <button id="add-to-cart" class="bg-blue-500 text-white px-4 py-2 rounded">추가</button>
    </div>
  </div>`;
};

export const getCartItemLiteral = (
  cartItem: CartItem
) => `<div class="flex justify-between items-center mb-2">
    <span>${cartItem.product.name} - ${cartItem.product.price}원 x ${cartItem.quantity}</span>
    <div>
      <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${cartItem.product.id}" data-change="-1">-</button>
      <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${cartItem.product.id}" data-change="1">+</button>
      <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${cartItem.product.id}">삭제</button>
    </div>
  </div>`;

export const getCartTotalLiteral = (discountDetail: DiscountDetail) => {
  const discountText =
    discountDetail.discountRate > 0
      ? `(${(discountDetail.discountRate * 100).toFixed(1)}% 할인 적용)`
      : '';

  return `총액: ${Math.round(discountDetail.total)}원
    <span class="text-green-500 ml-2">
      ${discountText}
    </span>
  `;
};
