import { createElement } from '../../utils/domUtils';

/**
 * 상품 옵션 요소를 생성하고 선택 요소에 추가합니다.
 * @param {HTMLSelectElement} selectedProductElement - 상품을 선택할 select 요소
 * @param {Array<Object>} productList - 상품 목록
 */
export const createProductOptionElement = (
  selectedProductElement,
  productList
) => {
  productList.forEach((product) => {
    const optionText = formatProductOptionText(product);
    const optionElement = createElement(
      'option',
      '',
      '',
      optionText,
      product.id
    );
    selectedProductElement.appendChild(optionElement);
  });
};

/**
 * 상품 옵션의 텍스트를 포맷팅합니다.
 * @param {Object} product - 상품 객체
 * @param {string} product.name - 상품 이름
 * @param {number} product.price - 상품 가격
 * @returns {string} 포맷팅된 옵션 텍스트
 */
const formatProductOptionText = ({ name, price }) => {
  return `${name} - ${price}원`;
};
