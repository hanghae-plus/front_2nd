export const createCartHTML = () => {
  return `
    <div class="bg-gray-100 p-8">
      <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 class="text-2xl font-bold mb-4">장바구니</h1>
        <div id="cart-items"></div>
        <div id="cart-total" class="text-xl font-bold my-4"></div>
        <select id="product-select" class="border rounded p-2 mr-2"></select>
        <button id="add-to-cart" class="bg-blue-500 text-white px-4 py-2 rounded">추가</button>
      </div>
    </div>
  `;
};

export const createCartItemHTML = (product, quantity) => {
  return `
    <div id="${product.id}" class="flex justify-between items-center mb-2">
      <span>${product.name} - ${product.price}원 x ${quantity}</span>
      <div>
        <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${product.id}" data-change="-1">-</button>
        <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${product.id}" data-change="1">+</button>
        <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${product.id}">삭제</button>
      </div>
    </div>
  `;
};

/**
 * 할인율 텍스트를 생성합니다.
 * @param {number} discountRate - 할인율 (0 ~ 1 사이의 값)
 * @returns {string} 할인율 텍스트
 */
const createDiscountText = (discountRate) => {
  if (Number.isNaN(discountRate) || discountRate <= 0) return '';
  const discountPercentage = (discountRate * 100).toFixed(1);
  return `(${discountPercentage}% 할인 적용)`;
};

/**
 * 장바구니 총액 표시를 업데이트합니다.
 * @param {HTMLElement} cartTotalElement - 총액을 표시할 요소
 * @param {Object} cartResult - 장바구니 계산 결과
 * @param {number} cartResult.finalTotal - 최종 총액
 * @param {number} cartResult.discountRate - 할인율
 */
export const updateCartDisplay = (cartTotal, { finalTotal, discountRate }) => {
  const discountText = createDiscountText(discountRate);
  cartTotal.innerHTML = `
    <span>총액: ${finalTotal}원</span>
    ${discountText ? `<span class="text-green-500 ml-2">${discountText}</span>` : ''}
  `;
};
