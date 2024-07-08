export function createAppTemplate() {
  return `<div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
              <h1 class="text-2xl font-bold mb-4">장바구니</h1>
              <div id="cart-items"></div>
              <div id="cart-total" class="text-xl font-bold my-4"></div>
              <select id="product-select" class="border rounded p-2 mr-2"></select>
              <button id="add-to-cart" class="bg-blue-500 text-white px-4 py-2 rounded">추가</button>
            </div>`;
}

export function createCartItem({ productId, productName, price, quantity }) {
  return `
            <span>${productName} - ${price}원 x ${quantity}</span>
            <div>
                <button 
                    class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
                    data-product-id="${productId}"
                    data-change="-1"
                >-</button>
                <button
                    class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
                    data-product-id="${productId}"
                    data-change="1"
                >+</button>
                <button 
                    class="remove-item bg-red-500 text-white px-2 py-1 rounded" 
                    data-product-id="${productId}"
                >삭제</button>
            </div>
  `;
}

export function createCartTotalPrice({ totalPrice, appliedDiscountRate = 0 }) {
  return `총액: ${totalPrice}원${appliedDiscountRate > 0 ? `<span class="text-green-500 ml-2">${(appliedDiscountRate * 100).toFixed(1)}% 할인 적용</span>` : ''}`;
}

export const createProductOption = ({ productId, productName, price }) => {
  return `
      <option value="${productId}">${productName} - ${price}원</option>
  `;
};
