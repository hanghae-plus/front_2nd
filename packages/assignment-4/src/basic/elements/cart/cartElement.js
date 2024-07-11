import { createButton, createElement } from '../../utils/domUtils';

/**
 * 장바구니 총액을 업데이트합니다.
 * @param {HTMLElement} cartTotalDivElement - 총액을 표시할 요소
 * @param {number} finalTotal - 최종 총액
 */
export const changeTotalElement = (cartTotalDivElement, finalTotal) => {
  cartTotalDivElement.textContent = `총액: ${Math.round(finalTotal)}원`;
};

/**
 * 할인 정보를 추가합니다.
 * @param {HTMLElement} cartTotalDivElement - 할인 정보를 추가할 요소
 * @param {number} discountRatio - 할인 비율 (0-1 사이의 값)
 */
export const changeDiscountElement = (cartTotalDivElement, discountRatio) => {
  const discountPercentage = (discountRatio * 100).toFixed(1);
  const discountSpanElement = createElement(
    'span',
    'text-green-500 ml-2',
    '',
    `(${discountPercentage}% 할인 적용)`
  );
  cartTotalDivElement.appendChild(discountSpanElement);
};

/**
 * 상품 요소를 생성하고 장바구니에 추가합니다.
 * @param {Object} productItem - 상품 정보
 * @param {HTMLElement} cardItemsDivElement - 장바구니 아이템 컨테이너
 */
export const addProductElement = (productItem, cardItemsDivElement) => {
  const productItemDivElement = createElement(
    'div',
    'flex justify-between items-center mb-2',
    productItem.id
  );

  const productContentSpanElement = createElement(
    'span',
    '',
    '',
    `${productItem.name} - ${productItem.price}원 x 1`
  );

  const buttonsBlockDivElement = createElement('div');

  const buttons = [
    createButton(
      'quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1',
      '-',
      { productId: productItem.id, change: -1 }
    ),
    createButton(
      'quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1',
      '+',
      { productId: productItem.id, change: 1 }
    ),
    createButton(
      'remove-item bg-red-500 text-white px-2 py-1 rounded',
      '삭제',
      { productId: productItem.id }
    ),
  ];

  buttons.forEach((button) => buttonsBlockDivElement.appendChild(button));

  productItemDivElement.append(
    productContentSpanElement,
    buttonsBlockDivElement
  );
  cardItemsDivElement.appendChild(productItemDivElement);
};

/**
 * 상품 요소의 수량을 업데이트합니다.
 * @param {HTMLElement} product - 업데이트할 상품 요소
 * @param {Object} productItem - 상품 정보
 */
export const updateProductElement = (product, productItem) => {
  const quantityElement = product.querySelector('span');
  const currentQuantity = parseInt(quantityElement.textContent.split('x ')[1]);
  const newQuantity = currentQuantity + 1;
  quantityElement.textContent = `${productItem.name} - ${productItem.price}원 x ${newQuantity}`;
};

/**
 * 상품의 수량을 변경하거나 상품을 제거합니다.
 * @param {HTMLElement} item - 변경할 상품 요소
 * @param {HTMLElement} target - 클릭된 버튼 요소
 */
export const updateProductQuantity = (item, target) => {
  const quantityElement = item.querySelector('span');
  const [productInfo, currentQuantity] =
    quantityElement.textContent.split('x ');
  const changeQuantity = parseInt(target.dataset.change);
  const newQuantity = parseInt(currentQuantity) + changeQuantity;

  if (target.classList.contains('quantity-change') && newQuantity > 0) {
    quantityElement.textContent = `${productInfo}x ${newQuantity}`;
  } else if (
    (target.classList.contains('quantity-change') && newQuantity <= 0) ||
    target.classList.contains('remove-item')
  ) {
    item.remove();
  }
};
