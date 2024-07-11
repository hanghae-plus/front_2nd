import { SELECTORS } from '../../../shared/constants/element';
import { getElement } from '../../../shared/utils/element';
import { createCartService } from '../service/cartService';
import { createDiscountService } from '../service/discountService';
import { createCartHTML } from './CartItem';
import { createProductSelect } from './ProductSelect';

export const initializeCart = (products, discountRates, bulkDiscountRate, bulkDiscountThreshold) => {
  const app = getElement(SELECTORS.APP);
  app.innerHTML = createCartHTML();

  const elements = {
    productSelect: getElement(SELECTORS.PRODUCT_SELECT),
    addToCartButton: getElement(SELECTORS.ADD_TO_CART_BUTTON),
    cartItems: getElement(SELECTORS.CART_ITEMS),
    cartTotal: getElement(SELECTORS.CART_TOTAL),
  };

  const populateProductSelect = createProductSelect(products);
  populateProductSelect(elements.productSelect);

  const discountService = createDiscountService(discountRates, bulkDiscountRate, bulkDiscountThreshold);
  const cartService = createCartService(products, discountService);

  elements.addToCartButton.addEventListener('click', () => cartService.addToCart(elements));
  elements.cartItems.addEventListener('click', (event) => cartService.handleCartItemActions(event, elements));

  return elements;
};
