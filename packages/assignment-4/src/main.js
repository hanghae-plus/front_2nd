//비즈니스 로직
/** 상품목록*/
const products = [
  { id: 'p1', name: '상품1', price: 10000 },
  { id: 'p2', name: '상품2', price: 20000 },
  { id: 'p3', name: '상품3', price: 30000 },
];

/** 할인율 */
const discountRate = {
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

/** 할인율 계산 함수(개별)
 * @param 아이템 Id
 * @quantity 아이템 수량
 */
const caculateDiscount = (itemId, quantity) => {
  if (quantity < 10) {
    return 0;
  }
  return discountRate[itemId];
};

/** id로 상품 찾기
 * @param 상품 id
 */
const findProductByID = (id) => {
  return products.find((product) => product.id === id);
};

function main() {
  /**  상품목록*/

  /**app root**/
  var a = document.getElementById('app');

  /**root내부 회색 배경 */
  var w = document.createElement('div');
  w.className = 'bg-gray-100 p-8';

  /**장바구니를 감싸고 있는 card */
  var b = document.createElement('div');
  b.className =
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';

  /**card내부 title */
  var h = document.createElement('h1');
  h.className = 'text-2xl font-bold mb-4';
  h.textContent = '장바구니';

  /**장바구니에 담긴 item div */
  var ct = document.createElement('div');
  ct.id = 'cart-items';

  /**가격 총액을 담고 있는 div */
  var tt = document.createElement('div');
  tt.id = 'cart-total';
  tt.className = 'text-xl font-bold my-4';

  /** 상품 목록 select*/
  var s = document.createElement('select');
  s.id = 'product-select';
  s.className = 'border rounded p-2 mr-2';

  /**상품 추가 버튼 */
  var ab = document.createElement('button');
  ab.id = 'add-to-cart';
  ab.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  ab.textContent = '추가';

  // 상품목록 select에 option을 넘어주는 반복문
  products.forEach((product) => {
    const option = document.createElement('option');
    option.value = product.id;
    option.textContent = `${product.name}-${product.price}원`;
    s.appendChild(option);
  });

  b.appendChild(h);
  b.appendChild(ct);
  b.appendChild(tt);
  b.appendChild(s);
  b.appendChild(ab);
  w.appendChild(b);
  a.appendChild(w);

  /**총액을 계산하는 함수 */
  function updateCart() {
    let items = Array.from(ct.children);

    let { total, totalQuantity, totalBeforeDiscount } = items.reduce(
      (acc, currentProduct) => {
        const product = findProductByID(currentProduct.id);

        const quantity = parseInt(
          currentProduct.querySelector('span').textContent.split('x ')[1]
        );

        const itemTotal = product.price * quantity;
        const discountRate = caculateDiscount(product.id, quantity);

        return {
          total: acc.total + itemTotal * (1 - discountRate),
          totalQuantity: acc.totalQuantity + quantity,
          totalBeforeDiscount: acc.totalBeforeDiscount + itemTotal,
        };
      },
      { total: 0, totalQuantity: 0, totalBeforeDiscount: 0 }
    );

    /**할인율 */
    let newDiscountRate = 0;

    //물품의 총갯수가 30개 이상이라면??
    if (totalQuantity >= MIN_DISCOUNT_QUANTITY.bulk) {
      //25퍼센트 할인 금액
      const bulkDiscount = totalBeforeDiscount * discountRate.bulk;
      //개별 할인 금액
      const individualDiscount = totalBeforeDiscount - total;

      //25퍼센트 할인금액이 개별 할인 금액보다 크다면??
      if (bulkDiscount > individualDiscount) {
        total = totalBeforeDiscount * (1 - discountRate.bulk);
        newDiscountRate = discountRate.bulk;
      }
      //개별할인 금액이 더 크다면??
      else {
        newDiscountRate = (totalBeforeDiscount - total) / totalBeforeDiscount;
      }
    }
    //물품의 총갯수가 30개 미만이라면??
    else {
      newDiscountRate = (totalBeforeDiscount - total) / totalBeforeDiscount;
    }

    const discountRateRounded = Math.round(total);
    tt.textContent = `총액: ${discountRateRounded}원`;

    if (newDiscountRate > 0) {
      //네이밍 기억이..?
      const formattingDiscountRate = (newDiscountRate * 100).toFixed(1);

      const $discountSpan = document.createElement('span');
      $discountSpan.className = 'text-green-500 ml-2';
      $discountSpan.textContent = `(${formattingDiscountRate}% 할인 적용)`;

      tt.appendChild($discountSpan);
    }
  }

  /**추가 버튼 이벤트 핸들러 */
  ab.onclick = function () {
    /**현재 select된 item의 id값 */
    var v = s.value;

    /**클릭한 상품의 세부 목록(objec) */
    var i;

    /**상품 목록에서 선택한 id로 값을 찾는 과정 */
    for (var k = 0; k < products.length; k++) {
      if (products[k].id === v) {
        i = products[k];
        break;
      }
    }

    if (i) {
      var e = document.getElementById(i.id);

      //선택한 상품이 이미 장바구니에 있다면??
      if (e) {
        var q =
          parseInt(e.querySelector('span').textContent.split('x ')[1]) + 1;
        e.querySelector('span').textContent =
          i.name + ' - ' + i.price + '원 x ' + q;
      }
      //선택한 상품이 장바구니에 없다면??
      else {
        /**상품의 id를 해당 태그 id로 지정 */
        var d = document.createElement('div');
        /**장바구니 상품 정보 span */
        var sp = document.createElement('span');
        /**장바구니 아이템에 버튼을 grouping하는 div */
        var bd = document.createElement('div');
        /**상품 +버튼 */
        var mb = document.createElement('button');
        /**상품 -버튼 */
        var pb = document.createElement('button');
        /**상품 삭제 버튼 */
        var rb = document.createElement('button');

        d.id = i.id;
        d.className = 'flex justify-between items-center mb-2';
        sp.textContent = i.name + ' - ' + i.p + '원 x 1';

        //상품 +버튼 관련
        mb.className =
          'quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1';
        mb.textContent = '-';
        mb.dataset.productId = i.id;
        mb.dataset.change = '-1';

        //상품 +버튼 관련
        pb.className =
          'quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1';
        pb.textContent = '+';
        pb.dataset.productId = i.id;
        pb.dataset.change = '1';

        //상품 삭제 버튼 관련
        rb.className = 'remove-item bg-red-500 text-white px-2 py-1 rounded';
        rb.textContent = '삭제';
        rb.dataset.productId = i.id;
        bd.appendChild(mb);
        bd.appendChild(pb);
        bd.appendChild(rb);
        d.appendChild(sp);
        d.appendChild(bd);
        ct.appendChild(d);
      }
      //금액 업데이트
      updateCart();
    }
  };

  /**장바구니에 담긴 상품 버튼들에 대한 이벤트(+,-,삭제 버튼) */
  ct.onclick = function (event) {
    var target = event.target;

    /**
     * 버튼의 class에 'quantity-chagne'(+,- 버튼) 혹은
     * 'remove-item'(삭제 버튼)이 포함되어 있다면??
     */
    if (
      target.classList.contains('quantity-change') ||
      target.classList.contains('remove-item')
    ) {
      var productId = target.dataset.productId;

      /**장바구니에 있는 아이템 */
      var item = document.getElementById(productId);

      // +,- 버튼일 경우
      if (target.classList.contains('quantity-change')) {
        /**해당 버튼의 change dataset
         * -버튼의 경우 data property로 -1
         * +버튼의 경우 data property로 +1
         */
        var change = parseInt(target.dataset.change);

        /**해당 아이템의 총 수량 */
        var quantity =
          parseInt(item.querySelector('span').textContent.split('x ')[1]) +
          change;

        // 수량이 1개이상인 경우
        if (quantity > 0) {
          item.querySelector('span').textContent =
            item.querySelector('span').textContent.split('x ')[0] +
            'x ' +
            quantity;
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
      updateCart();
    }
  };
}

main();
