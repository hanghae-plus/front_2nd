import { createCartItemHTML, updateCartDisplay } from '../components/CartItem';
import { extractCartItemsData } from '../utils/cartUtils';

const QUANTITY_SEPARATOR = 'x ';
const BUTTON_CLASSES = {
  QUANTITY_CHANGE: 'quantity-change',
  REMOVE_ITEM: 'remove-item',
};

export function createCartService(products, discountService) {
  /**
   * 상품 ID로 상품을 찾습니다.
   * @param {string} productId - 상품 ID
   * @returns {Object|undefined} 찾은 상품 객체 또는 undefined
   */
  const findProduct = (productId) => products.find((product) => product.id === productId);

  /**
   * 장바구니를 업데이트합니다.
   * @param {Object} elements - DOM 요소들
   */
  const updateCart = (elements) => {
    const cartItemsData = extractCartItemsData(elements.cartItems.children, findProduct);
    const cartResult = discountService.calculateCart(cartItemsData);
    updateCartDisplay(elements.cartTotal, cartResult);
  };

  /**
   * 상품 수량을 업데이트합니다.
   * @param {HTMLElement} item - 상품 요소
   * @param {number} change - 변경할 수량
   * @returns {boolean} 수량 업데이트 성공 여부
   */
  const updateItemQuantity = (item, change) => {
    const quantitySpan = item.querySelector('span');
    const [productInfo, currentQuantity] = quantitySpan.textContent.split(QUANTITY_SEPARATOR);
    const newQuantity = parseInt(currentQuantity, 10) + change;

    if (newQuantity > 0) {
      quantitySpan.textContent = `${productInfo}${QUANTITY_SEPARATOR}${newQuantity}`;
      return true;
    }

    item.remove();
    return false;
  };

  /**
   * 버튼이 유효한지 확인합니다.
   * @param {HTMLElement} target - 클릭된 요소
   * @returns {boolean} 버튼 유효성 여부
   */
  const isValidButton = (target) =>
    target.classList.contains(BUTTON_CLASSES.QUANTITY_CHANGE) || target.classList.contains(BUTTON_CLASSES.REMOVE_ITEM);

  /**
   * 장바구니 아이템 액션을 처리합니다.
   * @param {Event} event - 클릭 이벤트
   * @param {Object} elements - DOM 요소들
   */
  const handleCartItemActions = (event, elements) => {
    const { target } = event;

    if (!isValidButton(target)) return;

    const { productId } = target.dataset;
    const item = document.getElementById(productId);

    if (!item) {
      console.error(`상품 아이템을 찾을 수 없습니다: ${productId}`);
      return;
    }

    if (target.classList.contains(BUTTON_CLASSES.QUANTITY_CHANGE)) {
      const change = parseInt(target.dataset.change, 10);
      updateItemQuantity(item, change);
    } else if (target.classList.contains(BUTTON_CLASSES.REMOVE_ITEM)) {
      item.remove();
    }

    updateCart(elements);
  };

  /**
   * 장바구니에 상품을 추가합니다.
   * @param {Object} elements - DOM 요소들
   */
  const addNewCartItem = (cartItemsElement, product) => {
    const cartItemHTML = createCartItemHTML(product, 1);
    cartItemsElement.insertAdjacentHTML('beforeend', cartItemHTML);
  };

  /**
   * 기존 장바구니 아이템을 업데이트합니다.
   * @param {HTMLElement} item - 기존 상품 요소
   * @param {Object} product - 상품 정보
   */
  const updateExistingCartItem = (item, product) => {
    const quantitySpan = item.querySelector('span');
    const [, quantityText] = quantitySpan.textContent.split(QUANTITY_SEPARATOR);
    const newQuantity = parseInt(quantityText, 10) + 1;
    quantitySpan.textContent = `${product.name} - ${product.price}원 x ${newQuantity}`;
  };

  /**
   * 새로운 장바구니 아이템을 추가합니다.
   * @param {HTMLElement} cartItemsElement - 장바구니 아이템 컨테이너
   * @param {Object} product - 상품 정보
   */
  function addToCart(elements) {
    const { value } = elements.productSelect;
    const selectedProduct = findProduct(value);
    if (!selectedProduct) return;

    const existingItem = document.getElementById(selectedProduct.id);
    if (existingItem) {
      updateExistingCartItem(existingItem, selectedProduct);
    } else {
      addNewCartItem(elements.cartItems, selectedProduct);
    }

    updateCart(elements);
  }

  return {
    addToCart,
    updateCart,
    handleCartItemActions,
  };
}
