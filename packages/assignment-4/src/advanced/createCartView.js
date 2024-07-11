import { CartItem, CartTotal } from './templates.js';
import { createNodeFromHTML } from './utils/domUtils.js';

/**
 * 장바구니 뷰를 생성합니다.
 * @function
 * @param {Object} cart - 장바구니 객체
 * @param {Array} productList - 제품 목록
 * @returns {Object} 장바구니 뷰 메서드를 포함한 객체
 */
export const createCartView = (cart, productList) => {
  /**
   * 장바구니 내용을 렌더링합니다.
   * @function
   */
  const renderCart = () => {
    const cartItemsElement = document.getElementById('cart-items');
    cartItemsElement.innerHTML = '';
    cart.getItems().forEach((item) => {
      const itemElement = createNodeFromHTML(CartItem(item));
      cartItemsElement.appendChild(itemElement);
    });

    const cartTotalElement = document.getElementById('cart-total');
    cartTotalElement.innerHTML = CartTotal(cart.getTotal());
  };

  /**
   * 이벤트 리스너를 설정합니다.
   * @function
   */
  const setupEventListeners = () => {
    setupAddToCartListener();
    setupCartItemsListener();
  };

  /**
   * '장바구니에 추가' 버튼에 대한 이벤트 리스너를 설정합니다.
   * @function
   */
  const setupAddToCartListener = () => {
    const addToCartButton = document.getElementById('add-to-cart');
    addToCartButton.addEventListener('click', handleAddToCart);
  };

  /**
   * 장바구니 항목에 대한 이벤트 리스너를 설정합니다.
   * @function
   */
  const setupCartItemsListener = () => {
    const cartItemsElement = document.getElementById('cart-items');
    cartItemsElement.addEventListener('click', handleCartItemAction);
  };

  /**
   * 장바구니에 상품을 추가하는 핸들러입니다.
   * @function
   */
  const handleAddToCart = () => {
    const selectedProductId = document.getElementById('product-select').value;
    const selectedProduct = productList.find((p) => p.id === selectedProductId);
    if (selectedProduct) {
      cart.addItem(selectedProduct);
      renderCart();
    }
  };

  /**
   * 장바구니 항목에 대한 액션을 처리하는 핸들러입니다.
   * @function
   * @param {Event} event - 클릭 이벤트 객체
   */
  const handleCartItemAction = (event) => {
    const target = event.target;
    if (target.classList.contains('quantity-change')) {
      handleQuantityChange(target);
    } else if (target.classList.contains('remove-item')) {
      handleRemoveItem(target);
    }
  };

  /**
   * 수량 변경을 처리합니다.
   * @function
   * @param {HTMLElement} target - 클릭된 요소
   */
  const handleQuantityChange = (target) => {
    const productId = target.dataset.productId;
    const change = parseInt(target.dataset.change);
    const currentItem = cart
      .getItems()
      .find((item) => item.product.id === productId);
    const newQuantity = currentItem.quantity + change;
    cart.updateQuantity(productId, newQuantity);
    renderCart();
  };

  /**
   * 항목 제거를 처리합니다.
   * @function
   * @param {HTMLElement} target - 클릭된 요소
   */
  const handleRemoveItem = (target) => {
    const productId = target.dataset.productId;
    cart.removeItem(productId);
    renderCart();
  };

  return {
    render: renderCart,
    init: setupEventListeners,
  };
};
