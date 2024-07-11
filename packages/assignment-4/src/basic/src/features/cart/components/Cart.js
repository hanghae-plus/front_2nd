import { SELECTORS } from '../../../shared/constants/element';
import { PRODUCTS } from '../../../shared/constants/product';
import { getElement } from '../../../shared/utils/element';
import { addToCart, handleCartItemActions } from '../service/cartService';
import { createCartHTML } from './CartItem';
import { populateProductSelect } from './ProductSelect';

export function initializeCart() {
  const app = getElement(SELECTORS.APP);
  app.innerHTML = createCartHTML();

  const elements = {
    productSelect: getElement(SELECTORS.PRODUCT_SELECT),
    addToCartButton: getElement(SELECTORS.ADD_TO_CART_BUTTON),
    cartItems: getElement(SELECTORS.CART_ITEMS),
    cartTotal: getElement(SELECTORS.CART_TOTAL),
  };

  populateProductSelect(elements.productSelect, PRODUCTS);

  elements.addToCartButton.addEventListener('click', () => addToCart(elements));
  elements.cartItems.addEventListener('click', (event) => handleCartItemActions(event, elements));

  return elements;
}
