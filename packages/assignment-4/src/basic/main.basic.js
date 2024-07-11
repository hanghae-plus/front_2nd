import { productList } from './data/product';
import { createLayout, createMainLayout } from './elements/layout/layout';
import { createProductOptionElement } from './elements/option/optionElement';
import { handleAddToCart, handleCartItemUpdate } from './handler/cartHandler';

function main() {
  const { boxDivElement } = createLayout();

  const {
    cartTotalDivElement,
    cardItemsDivElement,
    selectedProductElement,
    addToCartButton,
  } = createMainLayout(boxDivElement);

  createProductOptionElement(selectedProductElement, productList);

  addToCartButton.onclick = () =>
    handleAddToCart(
      selectedProductElement,
      cardItemsDivElement,
      cartTotalDivElement
    );

  cardItemsDivElement.onclick = (event) =>
    handleCartItemUpdate(event, cartTotalDivElement, cardItemsDivElement);
}

main();
