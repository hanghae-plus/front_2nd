/**
 * @typedef {Object} Product
 * @property {string} id - 상품 ID
 * @property {string} name - 상품 이름
 * @property {number} price - 상품 가격
 */

/**
 * 상품 선택 옵션 요소를 생성합니다.
 * @param {Product} product - 상품 객체
 * @returns {string} HTML 옵션 요소 문자열
 */
export const ProductOption = (product) =>
  `<option value="${product.id}">${product.name} - ${product.price}원</option>`;

/**
 * 메인 레이아웃을 생성합니다.
 * @param {Object} props - 컴포넌트 속성
 * @param {Array<Product>} props.items - 상품 목록
 * @returns {string} HTML 레이아웃 문자열
 */
export const MainLayout = ({ items }) => `<div class="bg-gray-100 p-8">
    <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
      <h1 class="text-2xl font-bold mb-4">장바구니</h1>
        <div id="cart-items"></div>
        <div id="cart-total" class="text-xl font-bold my-4"></div>
        <select id="product-select" class="border rounded p-2 mr-2">
        ${items.map((item) => ProductOption(item)).join('')}
      </select>
        <button id="add-to-cart" class="bg-blue-500 text-white px-4 py-2 rounded">추가</button>
    </div>
  </div>`;

/**
 * 장바구니 아이템 요소를 생성합니다.
 * @param {Object} props - 컴포넌트 속성
 * @param {Product} props.product - 상품 객체
 * @param {number} props.quantity - 상품 수량
 * @returns {string} HTML 장바구니 아이템 요소 문자열
 */
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

/**
 * 장바구니 총액 요소를 생성합니다.
 * @param {Object} props - 컴포넌트 속성
 * @param {number} props.total - 총액
 * @param {number} props.discountRate - 할인율 (0 ~ 1 사이의 값)
 * @returns {string} HTML 장바구니 총액 요소 문자열
 */
export const CartTotal = ({ total, discountRate }) => {
  let result = `총액: ${total}원`;
  if (discountRate > 0) {
    result += ` <span class="text-green-500">${(discountRate * 100).toFixed(1)}% 할인 적용</span>`;
  }
  return result;
};
