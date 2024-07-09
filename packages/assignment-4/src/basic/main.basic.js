function main() {
  // 제품 데이터
  const productData = [
    { id: 'p1', name: '상품1', price: 10000, discountRate: 0.1 },
    { id: 'p2', name: '상품2', price: 20000, discountRate: 0.15 },
    { id: 'p3', name: '상품3', price: 30000, discountRate: 0.2 },
  ];

  // html 생성 함수
  function render(target, html, position = 'beforeend') {
    target.insertAdjacentHTML(position, html);
  }

  // 메인 레이아웃 렌더링
  render(
    document.getElementById('app'),
    `<div class="bg-gray-100 p-8">
      <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 class="text-2xl font-bold mb-4">장바구니</h1>
        <div id="cart-items"></div>
        <div id="cart-total" class="text-xl font-bold my-4"></div>
        <select id="product-select" class="border rounded p-2 mr-2">
          ${productData
            .map(
              (item) =>
                `<option value="${item.id}">${item.name} - ${item.price}원</option> `
            )
            .join('')}
        </select>
        <button id="add-to-cart" class="bg-blue-500 text-white px-4 py-2 rounded">추가</button>
      </div>
    </div>`
  );

  // 최소수량 상수
  const MINIMUM_AMOUNT = {
    individual: 10,
    bulk: 30,
  };
  // 벌크 할인율 상수
  const BULK_RATE = 0.25;

  // 장바구니 상태 객체
  const cartStatus = {
    // 제품 데이터 변환
    items: productData.reduce((acc, product) => {
      acc[product.id] = product;
      return acc;
    }, {}),
    // 제품별 수량
    quantity: productData.reduce((acc, product) => {
      acc[product.id] = 0;
      return acc;
    }, {}),
    totalQuantity: 0,
    originPrice: 0,

    // 제품별 수량 출력
    getQuantity(id) {
      return this.quantity[id];
    },
    // 제품 수량 및 가격 정보 저장
    updateItem(id, change) {
      const item = this.items[id];

      this.quantity[id] += change;
      this.totalQuantity += change;
      this.originPrice += item.price * change;
    },
    // 제품 삭제
    deleteItem(id) {
      const item = this.items[id];

      this.totalQuantity -= this.quantity[id];
      this.originPrice -= item.price * this.quantity[id];
      this.quantity[id] = 0;
    },
    // 최종 금액 및 최종 할인률 계산
    calcDiscount() {
      let finalPrice = 0;
      let finalRate = 0;

      const idArr = Object.keys(this.items);

      const individualPrice = idArr.reduce((acc, id) => {
        const quantity = this.quantity[id];
        const item = this.items[id];
        const price =
          quantity >= 10
            ? item.price * quantity * (1 - item.discountRate)
            : item.price * quantity;

        return acc + price;
      }, 0);
      const bulkPrice = this.originPrice * (1 - BULK_RATE);

      if (
        this.totalQuantity >= MINIMUM_AMOUNT.bulk &&
        bulkPrice < individualPrice
      ) {
        finalPrice = bulkPrice;
        finalRate = 0.25;
      } else {
        finalPrice = individualPrice;
        finalRate = (this.originPrice - individualPrice) / this.originPrice;
      }

      return { finalPrice, finalRate };
    },
  };

  const $cartItem = document.getElementById('cart-items');
  const $addButton = document.getElementById('add-to-cart');

  // 장바구니 화면 업데이트
  function updateCart(id) {
    // 장바구니 아이템
    const $item = document.getElementById(id);
    const itemData = cartStatus.items[id];

    if ($item) {
      if (cartStatus.getQuantity(id) === 0) {
        $item.remove();
      }

      $item.querySelector('span').textContent = `${
        $item.querySelector('span').textContent.split('x ')[0]
      }x ${cartStatus.getQuantity(id)}`;
    } else {
      render(
        $cartItem,
        `<div id="${itemData.id}" class="flex justify-between items-center mb-2">
          <span>${itemData.name} - ${itemData.price}원 x 1</span>
          <div>
            <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${itemData.id}" data-change="-1">-</button>
            <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${itemData.id}" data-change="1">+</button>
            <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${itemData.id}">삭제</button>
          </div>
        </div>`
      );
    }

    // 총액
    const $cartTotal = document.getElementById('cart-total');
    const { finalPrice, finalRate } = cartStatus.calcDiscount();

    $cartTotal.textContent = '총액: ' + Math.round(finalPrice) + '원';

    if (finalRate > 0) {
      render(
        $cartTotal,
        `<span class="text-green-500 ml-2">
        (${(finalRate * 100).toFixed(1)}% 할인 적용)
        </span>`
      );
    }
  }

  // 장바구니 추가 버튼 이벤트
  $addButton.onclick = function () {
    const $productSelect = document.getElementById('product-select');
    const selectedValue = $productSelect.value;
    const targetData = productData.find((item) => item.id === selectedValue);

    if (targetData) {
      const targetId = targetData.id;

      cartStatus.updateItem(targetId, 1);
      updateCart(targetId);
    }
  };

  // 장바구니 아이템 버튼 이벤트
  $cartItem.onclick = function (event) {
    const target = event.target;
    const productId = target.dataset.productId;

    if (target.classList.contains('quantity-change')) {
      const change = parseInt(target.dataset.change);
      cartStatus.updateItem(productId, change);
    } else if (target.classList.contains('remove-item')) {
      cartStatus.deleteItem(productId);
    }

    updateCart(productId);
  };
}

main();
