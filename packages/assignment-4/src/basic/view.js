import { onClickAddToCart, onClickCartItem } from './controller';
import { LAYOUTS, PRODUCTS, TEXT } from './model';
import { getQuantityOfCartRow, replaceText } from './utils';

function createLayout(layout, optionalProps) {
  const { type, props } = layout;

  const $el = document.createElement(type);

  if (props) setAttribute($el, props);
  if (optionalProps) setAttribute($el, optionalProps);

  return $el;
}

function setAttribute($el, prop) {
  for (const [key, value] of Object.entries(prop)) {
    $el[key] = value;
  }
}

export function app() {
  const $el = document.getElementById(LAYOUTS.app.props.id);

  const $wrapper = wrapper();
  $el.appendChild($wrapper);

  return $el;
}

function wrapper() {
  const $el = createLayout(LAYOUTS.wrapper);
  const $block = block();

  $el.appendChild($block);

  return $el;
}

function block() {
  const $el = createLayout(LAYOUTS.block);

  const $header = createLayout(LAYOUTS.header);
  $el.appendChild($header);

  const $cartTotal = createLayout(LAYOUTS.cartTotal);
  const $cartItem = cartItem($cartTotal);
  $el.appendChild($cartItem);
  $el.appendChild($cartTotal);

  const $productSelect = productSelect();
  const $addToCart = createLayout(LAYOUTS.addToCart);
  $el.appendChild($productSelect);
  $el.appendChild($addToCart);

  $addToCart.onclick = () => {
    onClickAddToCart($productSelect.value, $cartItem, $cartTotal);
  };

  return $el;
}

function cartItem(cartTotal) {
  const $el = createLayout(LAYOUTS.cartItem);

  $el.onclick = (event) => {
    onClickCartItem(event, $el, cartTotal);
  };

  return $el;
}

function productSelect() {
  const $el = createLayout(LAYOUTS.productSelect);

  PRODUCTS.forEach(({ id, name, price }) => {
    const $option = option(id, name, price);
    $el.appendChild($option);
  });

  return $el;
}

function option(id, name, price) {
  const $el = createLayout(LAYOUTS.option);

  $el.value = id;
  $el.textContent = replaceText(TEXT.optionText, { name, price });

  return $el;
}

export function updateCartRowText($cartRow, name, price) {
  const quantity = getQuantityOfCartRow($cartRow) + 1;
  const $rowText = $cartRow.querySelector('span');

  $rowText.textContent = replaceText(TEXT.cartRowInformText, {
    name,
    price,
    quantity,
  });
}

export function appendNewCartRow($cartItem, id, name, price) {
  const $cartRow = cartRow(id, name, price);

  $cartItem.appendChild($cartRow);
}

const MINUS_BUTTON_CHANGE = -1;
const PLUS_BUTTON_CHANGE = 1;
function cartRow(id, name, price) {
  const $el = createLayout(LAYOUTS.cartRow);
  $el.id = id;

  const quantity = 1;
  const textContent = replaceText(TEXT.cartRowInformText, {
    name,
    price,
    quantity,
  });
  const $informText = createLayout(LAYOUTS.informText, { textContent });
  $el.appendChild($informText);

  const $buttonContainer = createLayout(LAYOUTS.buttonContainer);
  $el.appendChild($buttonContainer);

  const $minusButton = button(LAYOUTS.minusButton, id, MINUS_BUTTON_CHANGE);
  $buttonContainer.appendChild($minusButton);

  const $plusButton = button(LAYOUTS.plusButton, id, PLUS_BUTTON_CHANGE);
  $buttonContainer.appendChild($plusButton);

  const $removeButton = button(LAYOUTS.removeButton, id);
  $buttonContainer.appendChild($removeButton);

  return $el;
}

function button(layout, productId, change) {
  const $el = createLayout(layout);

  if (productId) {
    $el.dataset.productId = productId;
  }

  if (change) {
    $el.dataset.change = change;
  }

  return $el;
}

export function discountSpan(discountRatio) {
  const $el = createLayout(LAYOUTS.discountSpan);

  const ratio = (discountRatio * 100).toFixed(1);
  $el.textContent = replaceText(TEXT.cartTotalDiscountText, { ratio });

  return $el;
}
