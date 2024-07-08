function main() {
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
  };

  // 할인율 계산 함수
  const getDiscountRate = (item, quantity) => {
    return quantity >= 10 ? DISCOUNT_RATES[item.id] ?? 0 : 0;
  };

  /**app root**/
  const $app = document.getElementById('app');

  /**root내부 회색 배경 */
  const $background = document.createElement('div');

  /**장바구니를 감싸고 있는 card */
  const $card = document.createElement('div');

  /**card내부 title */
  const $cardTitle = document.createElement('h1');

  /**장바구니에 담긴 item div */
  const $cart = document.createElement('div');

  /**가격 총액을 담고 있는 div */
  const $discountedTotalPrice = document.createElement('div');

  /** 상품 목록 select*/
  const $itemSelectbox = document.createElement('select');

  /**상품 추가 버튼 */
  const $addItemButton = document.createElement('button');

  // id나 class를 어떻게 정리해야할지 고민중..(상수이긴 한데..)
  $cart.id = 'cart-items';
  $discountedTotalPrice.id = 'cart-total';
  $itemSelectbox.id = 'product-select';
  $addItemButton.id = 'add-to-cart';
  $background.className = 'bg-gray-100 p-8';
  $card.className =
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';
  $cardTitle.className = 'text-2xl font-bold $minusButton-4';
  $discountedTotalPrice.className = 'text-xl font-bold my-4';
  $itemSelectbox.className = 'border rounded p-2 mr-2';
  $addItemButton.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  $cardTitle.textContent = '장바구니';
  $addItemButton.textContent = '추가';

  // 상품목록 select에 option을 넘어주는 반복문
  ITEM_LISTS.forEach((item) => {
    const $selectOption = document.createElement('option');
    $selectOption.value = item.id;
    $selectOption.textContent = `${item.title}-${item.price}+원`;
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
    /**총 금액(할인 o) */
    let discountedTotalPrice = 0;
    /**장바구니에 담긴 물품의 총 수량 */
    let totalQuantity = 0;
    /**장바구니에 담긴 children node */
    let items = $cart.children;
    /**총 금액(할인 x) */
    let totalPrice = 0;

    for (let m = 0; m < items.length; m++) {
      const item = ITEM_LISTS.find((item) => item.id === items[m].id);

      const quantity = parseInt(
        items[m].querySelector('span').textContent.split('x ')[1]
      );

      /**해당 id 아이템의 총 수량 */
      const itemTotal = item.price * quantity;

      totalQuantity += quantity;
      totalPrice += itemTotal;

      /**해당 id에 따른 할인율 */
      const discountRate = getDiscountRate(item, quantity);

      discountedTotalPrice += itemTotal * (1 - discountRate);
    }

    /**할인율 */
    let discountRate = 0;

    //물품의 총갯수가 30개 이상이라면??
    if (totalQuantity >= 30) {
      //25퍼센트 할인 금액
      const bulkDiscount = discountedTotalPrice * 0.25;
      //개별 할인 금액
      const individualDiscount = totalPrice - discountedTotalPrice;

      //25퍼센트 할인금액이 개별 할인 금액보다 크다면??
      if (bulkDiscount > individualDiscount) {
        discountedTotalPrice = totalPrice * 0.75;
        discountRate = 0.25;
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
      const $discountSpan = document.createElement('span');
      $discountSpan.className = 'text-green-500 ml-2';
      $discountSpan.textContent = `(${(discountRate * 100).toFixed(
        1
      )}% 할인 적용)`;
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
        const $itemList = document.createElement('div');
        /**장바구니 상품 정보 span */
        const $itemInform = document.createElement('span');
        /**장바구니 아이템에 버튼을 grouping하는 div */
        const $buttonGroup = document.createElement('div');
        /**상품 -버튼 */
        const $minusButton = document.createElement('button');
        /**상품 +버튼 */
        const $plusButton = document.createElement('button');
        /**상품 삭제 버튼 */
        const $removeButton = document.createElement('button');

        $itemList.id = targetItem.id;
        $itemList.className =
          'flex justify-between items-center $minusButton-2';
        $itemInform.textContent =
          targetItem.title + ' - ' + targetItem.price + '원 x 1';
        //상품 +버튼 관련
        $minusButton.className =
          'quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1';
        $minusButton.textContent = '-';
        $minusButton.dataset.productId = targetItem.id;
        $minusButton.dataset.change = '-1';

        //상품 +버튼 관련
        $plusButton.className =
          'quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1';
        $plusButton.textContent = '+';
        $plusButton.dataset.productId = targetItem.id;
        $plusButton.dataset.change = '1';

        //상품 삭제 버튼 관련
        $removeButton.className =
          'remove-item bg-red-500 text-white px-2 py-1 rounded';
        $removeButton.textContent = '삭제';
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
    if (
      target.classList.contains('quantity-change') ||
      target.classList.contains('remove-item')
    ) {
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

        // 수량이 1개이상인 경우
        if (quantity > 0) {
          item.querySelector(
            'span'
          ).textContent = `${targetItemInform}x ${quantity}`;
        }
        // 수량이 없는 경우
        else {
          item.remove();
        }
      }
      // 그외(삭제 버튼)의 경우
      else if (target.classList.contains('remove-item')) {
        item.remove();
      }
      updateTotalPrice();
    }
  }
}

main();
