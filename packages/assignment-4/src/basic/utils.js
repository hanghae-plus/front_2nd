import { discountRate, MIN_DISCOUNT_QUANTITY, products } from './constants';
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
/**총액을 계산하는 함수 */
export const updateCart = () => {
  const cart = document.querySelector('#cart-items');

  const items = Array.from(cart.children);

  let { total, totalQuantity, totalBeforeDiscount } =
    caculateTotalAndRate(items);

  const { optimalDiscountRate, optimalTotal } = caculateOptimalTotalAndRate(
    totalQuantity,
    totalBeforeDiscount,
    total
  );

  const $cartTotal = document.querySelector('#cart-total');
  const totalRounded = Math.round(optimalTotal);
  $cartTotal.textContent = `총액: ${totalRounded}원`;
  if (optimalDiscountRate > 0) {
    const discountPercentage = (optimalDiscountRate * 100).toFixed(1);

    const discountTemplate = `<span class='text-green-500 ml-2'>(${discountPercentage}% 할인 적용)</span>`;

    return render($cartTotal, createNode(discountTemplate));
  }
};

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

/**
 * 총 금액, 총 수량, 총 할인 전 금액 계산(누적 계싼)
 */
export const caculateTotalAndRate = (items) => {
  const { total, totalQuantity, totalBeforeDiscount } = items.reduce(
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
  return { total, totalQuantity, totalBeforeDiscount };
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
  let optimalDiscountRate = 0;
  let optimalTotal = individualDiscountedTotal;

  if (quantity >= MIN_DISCOUNT_QUANTITY.bulk) {
    const bulkDiscount = totalBeforeDiscount * discountRate.bulk;
    const individualDiscount = totalBeforeDiscount - individualDiscountedTotal;

    if (bulkDiscount > individualDiscount) {
      optimalTotal = totalBeforeDiscount * (1 - discountRate.bulk);
      optimalDiscountRate = discountRate.bulk;
    } else {
      optimalDiscountRate =
        (totalBeforeDiscount - optimalTotal) / totalBeforeDiscount;
    }
  } else {
    optimalDiscountRate =
      (totalBeforeDiscount - optimalTotal) / totalBeforeDiscount;
  }

  return { optimalDiscountRate, optimalTotal };
};
