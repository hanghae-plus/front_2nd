import { discountRate, MIN_DISCOUNT_QUANTITY, products } from './entitis';
//뷰 로직
/**node 만들기
 * @param template형식
 */
export const createNode = (template = ``) => {
  const templateElement = document.createElement('template');

  templateElement.innerHTML = template;

  const $node = templateElement.content.firstElementChild;

  return $node;
};

/**
 *
 * @param {*} parentNode
 * @param {*} childNode
 * @returns
 */
export const render = (parentNode, childNode) => {
  return parentNode.appendChild(childNode);
};

/**
 * 장바구니에 특정 상품을 렌더링 하는 함수
 * @param {상품} item
 */
export const renderCartItem = (item) => {
  const cartItemTemplate = `
    <div id="${item.id}" class="flex justify-between items-center mb-2">
      <span>${item.name} - ${item.price}원 x 1</span>
      <div>
        <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" 
                data-product-id="${item.id}" data-change="-1">-</button>
        <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" 
                data-product-id="${item.id}" data-change="1">+</button>
        <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" 
                data-product-id="${item.id}">삭제</button>
      </div>
    </div>
  `;

  const cart = document.querySelector('#cart-items');
  render(cart, createNode(cartItemTemplate));
};

//비즈니스 로직
/** 할인율 계산 함수(개별)
 * @param 아이템 Id
 * @quantity 아이템 수량
 */
export const caculateDiscount = (itemId, quantity) => {
  if (quantity < 10) {
    return 0;
  }
  return discountRate[itemId];
};

/** id로 상품 찾기
 * @param 상품 id
 */
export const findProductByID = (id) => {
  return products.find((product) => product.id === id);
};

/** 개별할인 Or bulk할인 중 할인율이 더 큰 것으로 계산하는 함수
 * @param1 수량
 * @param2 할인전 가격
 * @param3 개별할인으로 할인된 가격
 */
export const caculateOptimalTotalAndRate = (
  quantity,
  totalBeforeDiscount,
  individualDiscountedTotal
) => {
  let newDiscountRate = 0;
  let newTotal = individualDiscountedTotal;

  if (quantity >= MIN_DISCOUNT_QUANTITY.bulk) {
    //25퍼센트 할인 금액
    const bulkDiscount = totalBeforeDiscount * discountRate.bulk;
    //개별 할인 금액
    const individualDiscount = totalBeforeDiscount - individualDiscountedTotal;

    //25퍼센트 할인금액이 개별 할인 금액보다 크다면??
    if (bulkDiscount > individualDiscount) {
      newTotal = totalBeforeDiscount * (1 - discountRate.bulk);
      newDiscountRate = discountRate.bulk;
    }
    //개별할인 금액이 더 크다면??
    else {
      newDiscountRate = (totalBeforeDiscount - newTotal) / totalBeforeDiscount;
    }
  }
  //물품의 총갯수가 30개 미만이라면??
  else {
    newDiscountRate = (totalBeforeDiscount - newTotal) / totalBeforeDiscount;
  }

  return { newDiscountRate, newTotal };
};
