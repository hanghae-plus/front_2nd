import { createElement } from '../../utils/domUtils';

/**
 * 애플리케이션의 기본 레이아웃을 생성합니다.
 * @returns {Object} 생성된 boxDivElement
 */
export const createLayout = () => {
  const appElement = document.getElementById('app');
  const wrapperDivElement = createElement('div', 'bg-gray-100 p-8');
  const boxDivElement = createElement(
    'div',
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8'
  );

  appElement.appendChild(wrapperDivElement);
  wrapperDivElement.appendChild(boxDivElement);

  return { boxDivElement };
};

/**
 * 메인 레이아웃 요소를 생성합니다.
 * @param {HTMLElement} boxDivElement - 메인 레이아웃을 포함할 컨테이너 요소
 * @returns {Object} 생성된 레이아웃 요소들
 */
export const createMainLayout = (boxDivElement) => {
  const elements = {
    titleH1Element: createElement(
      'h1',
      'text-2xl font-bold mb-4',
      '',
      '장바구니'
    ),
    cartTotalDivElement: createElement(
      'div',
      'text-xl font-bold my-4',
      'cart-total'
    ),
    cardItemsDivElement: createElement('div', '', 'cart-items'),
    selectedProductElement: createElement(
      'select',
      'border rounded p-2 mr-2',
      'product-select'
    ),
    addToCartButton: createElement(
      'button',
      'bg-blue-500 text-white px-4 py-2 rounded',
      'add-to-cart',
      '추가'
    ),
  };

  Object.values(elements).forEach((element) =>
    boxDivElement.appendChild(element)
  );

  return elements;
};
