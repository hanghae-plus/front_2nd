//유틸/뷰 로직
/**
 * template만들기
 * @param  template
 */
const createTemplate = (template = ``) => {
  const templateElement = document.createElement('template');

  templateElement.innerHTML = template;

  // const $node = templateElement.content.firstElementChild;
  const $node = templateElement.content.firstChild;

  return $node;
};

//비즈니스 로직
/** 상품목록*/
const ITEM_LISTS = [
  { id: 'p1', title: '상품1', price: 10000 },
  { id: 'p2', title: '상품2', price: 20000 },
  { id: 'p3', title: '상품3', price: 30000 },
];

/** 할인율 */
const DISCOUNT_RATES = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
  bulk: 0.25,
};

/** 할인받을 수 있는 수량 */
const MIN_DISCOUNT_QUANTITY = {
  bulk: 30,
  individual: 10,
};

// 할인율 계산 함수
const getDiscountRate = (item, quantity) => {
  return quantity >= MIN_DISCOUNT_QUANTITY.individual
    ? DISCOUNT_RATES[item.id] ?? 0
    : 0;
};

function main() {
  /**app root**/
  const $app = document.getElementById('app');

  /**root내부 회색 배경 */
  const $background = createTemplate(`<div class='bg-gray-100 p-8'/>`);

  /**장바구니를 감싸고 있는 card */
  const $card = createTemplate(
    `<div class='max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8'/>`
  );

  /**card내부 title */
  const $cardTitle = createTemplate(
    `<h1 class='text-2xl font-bold $minusButton-4'>장바구니</h1>`
  );

  /**장바구니에 담긴 item div */
  const $cart = createTemplate(`<div id='cart-items'/>`);

  /**가격 총액을 담고 있는 div */
  const $discountedTotalPrice = createTemplate(
    `<div id='cart-total' class='text-xl font-bold my-4'/>`
  );

  /** 상품 목록 select*/
  const $itemSelectbox = createTemplate(
    `<select id='product-select' class='border rounded p-2 mr-2' />`
  );

  /**상품 추가 버튼 */
  const $addItemButton = createTemplate(
    `<button id='add-to-cart' class='bg-blue-500 text-white px-4 py-2 rounded'>추가</button>`
  );

  // 상품목록 select에 option을 넘어주는 반복문
  ITEM_LISTS.forEach((item) => {
    const $selectOption = createTemplate(
      `<option value=${item.id}>${item.title}-${item.price}+원</option>`
    );
    $itemSelectbox.appendChild($selectOption);
  });

  $card.appendChild($cardTitle);
  $card.appendChild($cart);
  $card.appendChild($discountedTotalPrice);
  $card.appendChild($itemSelectbox);
  $card.appendChild($addItemButton);
  $background.appendChild($card);
  $app.appendChild($background);

  /**총액을 계산하는 함수 */
  function updateTotalPrice() {
    /**장바구니에 담긴 children node */
    let items = Array.from($cart.children);

    /**
     * totalPrice : 총 금액(할인 x)
     * totalQuantity : 장바구니에 담긴 물품의 총 수량
     * discountedTotalPrice : 총 금액(할인 o)
     */
    let { totalPrice, totalQuantity, discountedTotalPrice } = items.reduce(
      (acc, currentItem) => {
        const item = ITEM_LISTS.find(
          (listItem) => listItem.id === currentItem.id
        );

        const quantity = parseInt(
          currentItem.querySelector('span').textContent.split('x ')[1]
        );
        const itemTotal = item.price * quantity;
        const discountRate = getDiscountRate(item, quantity);
        const discountedItemTotal = itemTotal * (1 - discountRate);

        return {
          totalQuantity: acc.totalQuantity + quantity,
          totalPrice: acc.totalPrice + itemTotal,
          discountedTotalPrice: acc.discountedTotalPrice + discountedItemTotal,
        };
      },
      { totalQuantity: 0, totalPrice: 0, discountedTotalPrice: 0 }
    );

    /**할인율 */
    let discountRate = 0;

    //물품의 총갯수가 30개 이상이라면??
    if (totalQuantity >= MIN_DISCOUNT_QUANTITY.bulk) {
      //25퍼센트 할인 금액
      const bulkDiscount = discountedTotalPrice * DISCOUNT_RATES.bulk;
      //개별 할인 금액
      const individualDiscount = totalPrice - discountedTotalPrice;

      //25퍼센트 할인금액이 개별 할인 금액보다 크다면??
      if (bulkDiscount > individualDiscount) {
        discountedTotalPrice = totalPrice * 0.75;
        discountRate = DISCOUNT_RATES.bulk;
      }
      //개별할인 금액이 더 크다면??
      else {
        discountRate = (totalPrice - discountedTotalPrice) / totalPrice;
      }
    }
    //물품의 총갯수가 30개 미만이라면??
    else {
      discountRate = (totalPrice - discountedTotalPrice) / totalPrice;
    }

    $discountedTotalPrice.textContent = `총액: ${Math.round(
      discountedTotalPrice
    )}원`;
    if (discountRate > 0) {
      const formattingDiscountRate = (discountRate * 100).toFixed(1);

      const $discountSpan = createTemplate(
        `<span class='text-green-500 ml-2'>(${formattingDiscountRate}% 할인 적용)</span>`
      );

      $discountedTotalPrice.appendChild($discountSpan);
    }
  }

  $addItemButton.addEventListener('click', () => addItemHandler());

  /**추가 버튼 이벤트 핸들러 */
  function addItemHandler() {
    /**현재 select된 item의 id값 */
    const selectedItemId = $itemSelectbox.value;

    /**클릭한 상품의 세부 목록(object) */
    const targetItem = ITEM_LISTS.find((item) => item.id === selectedItemId);

    if (targetItem) {
      const $targetItem = document.getElementById(targetItem.id);

      //선택한 상품이 이미 장바구니에 있다면??
      if ($targetItem) {
        const [_, currentQuantity] = $targetItem
          .querySelector('span')
          .textContent.split('x ');

        const quantity = parseInt(currentQuantity) + 1;
        $targetItem.querySelector(
          'span'
        ).textContent = `${targetItem.title} - ${targetItem.price}원 x ${quantity}`;
      }
      //선택한 상품이 장바구니에 없다면??
      else {
        /**상품의 id를 해당 태그 id로 지정 */
        const $itemList = createTemplate(
          `<div id=${targetItem.id} class='flex justify-between items-center $minusButton-2'/>`
        );

        /**장바구니 상품 정보 span */
        const $itemInform = createTemplate(
          `<span>${targetItem.title}-${targetItem.price}원 x 1</span>`
        );

        /**장바구니 아이템에 버튼을 grouping하는 div */
        const $buttonGroup = createTemplate(`<div/>`);

        /**상품 -버튼 */
        const $minusButton = createTemplate(
          `<button class='quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1'
          data-product-id=${targetItem.id} data-change='-1'
          >-</button>`
        );

        /**상품 +버튼 */

        const $plusButton = createTemplate(
          `<button class='quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1'
          data-product-id=${targetItem.id} data-change='1'
          >+</button>`
        );

        /**상품 삭제 버튼 */
        const $removeButton = createTemplate(
          `<button class='remove-item bg-red-500 text-white px-2 py-1 rounded'>삭제</button>`
        );

        $removeButton.dataset.productId = targetItem.id;
        $buttonGroup.appendChild($minusButton);
        $buttonGroup.appendChild($plusButton);
        $buttonGroup.appendChild($removeButton);
        $itemList.appendChild($itemInform);
        $itemList.appendChild($buttonGroup);
        $cart.appendChild($itemList);
      }
      //금액 업데이트
      updateTotalPrice();
    }
  }

  /**장바구니에 담긴 상품 버튼들에 대한 이벤트(+,-,삭제 버튼) */
  $cart.addEventListener('click', (event) => cartItemButtonHandler(event));
  function cartItemButtonHandler({ target }) {
    /**
     * 버튼의 class에 'quantity-chagne'(+,- 버튼) 혹은
     * 'remove-item'(삭제 버튼)이 포함되어 있다면??
     */
    // if (
    //   target.classList.contains('quantity-change') ||
    //   target.classList.contains('remove-item')
    // ) {
    const productId = target.dataset.productId;

    /**장바구니에 있는 아이템 */
    const item = document.getElementById(productId);

    // +,- 버튼일 경우
    if (target.classList.contains('quantity-change')) {
      /**해당 버튼의 change dataset
       * -버튼의 경우 data property로 -1
       * +버튼의 경우 data property로 +1
       */

      // +1일수도 -1일수도 있는데 어떻게??
      const change = parseInt(target.dataset.change);

      // 해당 아이템 구조분해
      const [targetItemInform, currentQuantity] = item
        .querySelector('span')
        .textContent.split('x ');

      /**해당 아이템의 총 수량 */
      const quantity = Number(currentQuantity) + change;
      quantity > 0
        ? (item.querySelector(
            'span'
          ).textContent = `${targetItemInform}x ${quantity}`)
        : item.remove();
    }
    // 그외(삭제 버튼)의 경우
    if (target.classList.contains('remove-item')) {
      item.remove();
    }
    updateTotalPrice();
  }
}

main();
