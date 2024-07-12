/**
 * 애플리케이션의 메인 레이아웃을 생성합니다.
 * @param {{ productId: string, productName: string; price: number; discount: [[number, number]] }[]} productList
 * @returns {string} 메인 레이아웃의 HTML 템플릿
 */
export const createMainLayoutElement = (productList) =>
  `<div class="bg-gray-100 p-8">
    <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
      <h1 class="text-2xl font-bold mb-4">장바구니</h1>
      <div id="cart-items"></div>
      <div id="cart-total" class="text-xl font-bold my-4"></div>
      <select id="product-select" class="border rounded p-2 mr-2">
        ${productList.map(createProductOptionElement).join('')}
      </select>
      <button id="add-to-cart" class="bg-blue-500 text-white px-4 py-2 rounded">추가</button>
    </div>
  </div>`;

/**
 * select 요소의 상품 옵션을 생성합니다.
 * @param {{ productId: string, productName: string; price: number; discount: [[number, number]] }} productObj
 * @returns {string} 상품 옵션의 HTML 템플릿
 */
export const createProductOptionElement = ({ productId, productName, price }) =>
  `<option value="${productId}">${productName} - ${price}원</option>`;

/**
 * 장바구니 아이템 레이아웃을 생성합니다.
 * @param {{ product: { productId: string, productName: string; price: number; discount: [[number, number]]}, quantity: number }} cartItemObj
 * @returns {string} 장바구니 아이템의 HTML 템플릿
 */
export const createCartItemElement = ({
  product: { productId, productName, price },
  quantity,
}) => `<div class="flex justify-between items-center mb-2">
    <span>${productName} - ${price}원 x ${quantity}</span>
    <div>
      <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${productId}" data-change="-1">-</button>
      <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${productId}" data-change="1">+</button>
      <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${productId}">삭제</button>
    </div>
  </div>`;

/**
 * 장바구니 총액 레이아웃을 생성합니다.
 * @param {{ total: number; discountRate: number }} cartTotalObj
 * @returns {string} 장바구니 총액의 HTML 템플릿
 */
export const createCartTotalElement = ({ total, discountRate }) =>
  `총액: ${total}원${discountRate > 0 ? `<span class="text-green-500 ml-2">${(discountRate * 100).toFixed(1)}% 할인 적용</span>` : ''}`;
