const PRODUCT_LIST = [
  {
    id: 'product-1',
    name: '상품1',
    price: 10000,
  },
  {
    id: 'product-2',
    name: '상품2',
    price: 20000,
  },
  {
    id: 'product-3',
    name: '상품3',
    price: 30000,
  },
];

function main() {
  // #region UI 생성
  const app = document.getElementById('app');

  const component = `
    <div class="bg-gray-100 p-8">
      <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 class="text-2xl font-bold mb-4">장바구니</h1>
        <div id="cart-items"></div>
        <div id="cart-total" class="text-xl font-bold my-4"></div>
        <select id="product-select" class="border rounded p-2 mr-2">
          ${PRODUCT_LIST.map(
            (product) =>
              `<option value=${product.id}>${product.name} - ${product.price}원</option>`
          )}
        </select>
        <button id="add-to-cart" class="bg-blue-500 text-white px-4 py-2 rounded">추가</button>
      </div>
    </div>
  `;

  app.innerHTML = component;
  // #endregion

  // #region event handler
  document.getElementById('add-to-cart').onclick = function () {
    const selectedId = document.getElementById('product-select').value;
    const selectedItem = PRODUCT_LIST.find(
      (product) => product.id === selectedId
    );

    if (!selectedItem) return;

    const element = document.getElementById(selectedItem.id);

    if (element) {
    } else {
    }
  };
  // #endregion
}

main();
