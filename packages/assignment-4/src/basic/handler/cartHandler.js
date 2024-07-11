import { productList } from '../data/product';
import {
  addProductElement,
  updateProductElement,
} from '../elements/cart/cartElement';
import { updateCart, updateProduct } from '../utils/cartUtils';

/**
 * 장바구니에 상품을 추가하는 함수
 * @param {HTMLSelectElement} selectedProductElement - 선택된 상품 요소
 * @param {HTMLDivElement} cardItemsDivElement - 장바구니 아이템 컨테이너
 * @param {HTMLDivElement} cartTotalDivElement - 장바구니 총액 요소
 */
export const handleAddToCart = (
  selectedProductElement,
  cardItemsDivElement,
  cartTotalDivElement
) => {
  const selectedProduct = selectedProductElement.value;
  const productItem = productList.find((value) => value.id === selectedProduct);

  if (!productItem) return;

  const product = document.getElementById(productItem.id);

  if (product) {
    updateProductElement(product, productItem);
  } else {
    addProductElement(productItem, cardItemsDivElement);
  }

  updateCart(cartTotalDivElement, cardItemsDivElement);
};

/**
 * 장바구니 아이템 업데이트를 처리하는 함수
 * @param {Event} event - 클릭 이벤트
 * @param {HTMLDivElement} cartTotalDivElement - 장바구니 총액 요소
 * @param {HTMLDivElement} cardItemsDivElement - 장바구니 아이템 컨테이너
 */
export const handleCartItemUpdate = (
  event,
  cartTotalDivElement,
  cardItemsDivElement
) => {
  const { target } = event;
  const isProductExist =
    target.classList.contains('quantity-change') ||
    target.classList.contains('remove-item');

  if (!isProductExist) return;

  updateProduct(target);
  updateCart(cartTotalDivElement, cardItemsDivElement);
};
