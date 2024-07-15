import { BUTTON_CLASSNAMES, DISCOUNTS, PRODUCTS, TEXT } from './model';
import { discountPrice, getQuantityOfCartRow, replaceText } from './utils';
import { appendNewCartRow, discountSpan, updateCartRowText } from './view';

export function onClickAddToCart(selectedId, $cartItem, $cartTotal) {
  const { id, name, price } = PRODUCTS.find(
    (product) => product.id === selectedId
  );

  if (!id || !name || !price) return;

  const $cartRow = document.getElementById(id);

  if ($cartRow) {
    updateCartRowText($cartRow, name, price);
  } else {
    appendNewCartRow($cartItem, id, name, price);
  }

  updateCart($cartItem, $cartTotal);
}

export function onClickCartItem(event, $cartItem, $cartTotal) {
  const target = event.target;

  const isPlusButton = target.classList.contains(BUTTON_CLASSNAMES.plus);
  const isMinusButton = target.classList.contains(BUTTON_CLASSNAMES.minus);
  const isRemoveButton = target.classList.contains(BUTTON_CLASSNAMES.remove);

  if (!isPlusButton && !isMinusButton && !isRemoveButton) {
    return;
  }

  const productId = target.dataset.productId;
  const $item = document.getElementById(productId);

  if (isRemoveButton) {
    $item.remove();
    updateCart($cartItem, $cartTotal);

    return;
  }

  const change = parseInt(target.dataset.change);
  const quantity = getQuantityOfCartRow($item) + change;

  if (quantity > 0) {
    const $rowText = $item.querySelector('span');
    updateQuantityOfRowText($rowText, quantity);
  } else {
    $item.remove();
  }

  updateCart($cartItem, $cartTotal);
}

function updateQuantityOfRowText($rowText, quantity) {
  $rowText.textContent = $rowText.textContent.split('x ')[0] + 'x ' + quantity;
}

function updateCart($cartItem, $cartTotal) {
  const [totalPrice, discountRatio] = calculateCartItems($cartItem);
  updateCartTotal($cartTotal, totalPrice, discountRatio);
}

function calculateCartItems($cartItem) {
  let totalPrice = 0;
  let totalQuantity = 0;
  let totalPriceBeforeDiscount = 0;

  for (const item of $cartItem.children) {
    if (!PRODUCTS.some((product) => product.id === item.id)) continue;

    const [itemTotalPrice, itemQuantity, itemDiscountRatio] =
      calculateIndividualItem(item);

    totalPrice += discountPrice(itemTotalPrice, itemDiscountRatio);
    totalQuantity += itemQuantity;
    totalPriceBeforeDiscount += itemTotalPrice;
  }

  const [totalPriceAfterDiscount, discountRatio] = calculateTotalDiscount(
    totalPrice,
    totalQuantity,
    totalPriceBeforeDiscount
  );

  return [totalPriceAfterDiscount, discountRatio];
}

function calculateIndividualItem($cartItem) {
  const quantity = getQuantityOfCartRow($cartItem);
  const price = PRODUCTS.find((product) => product.id === $cartItem.id).price;

  const totalPrice = price * quantity;

  const { ratio, threshold } = DISCOUNTS[$cartItem.id];
  const isDiscount = quantity >= threshold;
  const discountRatio = isDiscount ? ratio : 0;

  return [totalPrice, quantity, discountRatio];
}

function calculateTotalDiscount(
  totalPrice,
  totalQuantity,
  totalPriceBeforeDiscount
) {
  let totalPriceAfterDiscount = totalPrice;

  let discountRatio =
    (totalPriceBeforeDiscount - totalPrice) / totalPriceBeforeDiscount;

  const isBulkDiscount = totalQuantity >= DISCOUNTS.bulk.threshold;
  const isBulkDiscountRatioBigger = DISCOUNTS.bulk.ratio > discountRatio;
  if (isBulkDiscount && isBulkDiscountRatioBigger) {
    discountRatio = DISCOUNTS.bulk.ratio;
    totalPriceAfterDiscount = discountPrice(
      totalPriceBeforeDiscount,
      discountRatio
    );
  }

  return [totalPriceAfterDiscount, discountRatio];
}

function updateCartTotal($cartTotal, totalPrice, discountRatio) {
  const price = Math.round(totalPrice);
  $cartTotal.textContent = replaceText(TEXT.cartTotalPriceText, { price });

  if (!discountRatio || discountRatio === 0) return;

  const $discountSpan = discountSpan(discountRatio);

  $cartTotal.appendChild($discountSpan);
}
