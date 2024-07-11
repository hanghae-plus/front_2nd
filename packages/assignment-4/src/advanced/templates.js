export const ProductOption = (product) => `
  <option value="${product.id}">
    ${product.name} - ${product.price}원
  </option>
`;

export const MainLayout = ({ productList, bill, finalDiscountRate }) => `
  <div class="bg-gray-100 p-8">
    <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
      <h1 class="text-2xl font-bold mb-4">
        장바구니
      </h1>

      <div id="cart-items"></div>
      
      ${CartTotal(bill, finalDiscountRate)}
      
      <select id="product-select" class="border rounded p-2 mr-2">
        ${productList.map(ProductOption)}
      </select>

      <button id="add-to-cart" class="bg-blue-500 text-white px-4 py-2 rounded">
        추가
      </button>
    </div>
  </div>
`;

export const CartItem = (product, productQuantity) => `
  <div id="${product.id}" class="flex justify-between items-center mb-2">
    <span>
      ${product.name} - ${product.price}원 x ${productQuantity}
    </span>

    <div>
      <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-productId="${product.id}" data-change="-1">
        -
      </button>

      <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-productId="${product.id}" data-change="+1">
        +
      </button>
      
      <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-productId="${product.id}">
        삭제
      </button>
    </div>
  </div>
`;

export const CartTotal = (bill, finalDiscountRate) => `
  <div id="cart-total" class="text-xl font-bold my-4 hidden">
    총액: ${Math.round(bill)}

    <span class="text-green-500 ml-2">
      ${finalDiscountRate > 0 ? `${(finalDiscountRate * 100).toFixed(1)}% 할인 적용` : ''}
    </span>
  </div>
`;
