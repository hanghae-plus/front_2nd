import { createShoppingCart } from '/src/advanced/createShoppingCart.js';
import { createMainLayoutElement, createCartItemElement, createCartTotalElement } from '/src/advanced/templates.js';

/**
 * 장바구니 뷰를 생성합니다.
 * @param {HTMLElement} rootElement - 루트 요소
 * @param {{ productId: string; productName: string; price: number; discount: [[number, number]]}[]} productList - 상품 목록
 * @returns {object} 장바구니 뷰 업데이트 메서드 (renderCartItems, renderCartTotal)
 */
export const createCartView = (rootElement, productList) => {
  rootElement.innerHTML = createMainLayoutElement(productList);

  const { addItem, removeItem, updateQuantity, getTotal, getItems } = createShoppingCart();

  // 최초 items 등록
  productList.forEach((productObj) => addItem(productObj, 0));

  /**
   * 장바구니 관련 이벤트를 처리합니다.
   * @param {Event} event - 클릭 이벤트 객체
   */
  function handleCartEvents(event) {
    const { className, dataset, id } = event.target;

    if (className.includes('quantity-change')) {
      updateQuantity(dataset.productId, Number(dataset.change));
      return;
    }

    if (className.includes('remove-item')) {
      removeItem(dataset.productId);
      return;
    }

    if (id === 'add-to-cart') {
      const productSelectElement = rootElement.querySelector('#product-select');
      const selectedProductId = productSelectElement.value;
      const selectedProductObj = productList.find(({ productId }) => productId === selectedProductId);
      addItem(selectedProductObj);
      return;
    }
  }

  // 이벤트 위임을 통한 이벤트 처리
  rootElement.addEventListener('click', handleCartEvents);

  const cartItemsElement = rootElement.querySelector('#cart-items');
  /**
   * 장바구니 아이템을 렌더링합니다.
   */
  const renderCartItems = () => {
    const cartItemList = getItems();
    cartItemsElement.innerHTML = cartItemList
      .filter(({ quantity }) => quantity > 0)
      .map((cartItemObj) => createCartItemElement(cartItemObj))
      .join('');
  };

  const cartTotalElement = rootElement.querySelector('#cart-total');
  /**
   * 장바구니 총액을 렌더링합니다.
   */
  const renderCartTotal = () => {
    const { total, discountRate } = getTotal();
    cartTotalElement.innerHTML = createCartTotalElement({ total, discountRate });
  };

  return { renderCartItems, renderCartTotal };
};
