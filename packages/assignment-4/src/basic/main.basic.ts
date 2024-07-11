//#region Types
const MAX_QUANTITY = 999;
const MIN_QUANTITY = 0;

export interface Product {
  id: string;
  name: string;
  price: number;
}

export interface DiscountDetail {
  total: number;
  discountRate: number;
}

export class CartItem {
  product: Product;
  quantity: number;

  constructor(product: Product, quantity: number = 1) {
    this.product = product;
    this.quantity = quantity;
  }

  increaseQuantity(quantity: number) {
    this.quantity = Math.min(this.quantity + quantity, MAX_QUANTITY);
  }

  decreaseQuantity(quantity: number) {
    this.quantity = Math.max(this.quantity - quantity, MIN_QUANTITY);
  }

  equals(product: Product) {
    return this.product.id === product.id;
  }
}
//#endregion

export const PRODUCTS: Product[] = [
  { id: 'p1', name: '상품1', price: 10000 },
  { id: 'p2', name: '상품2', price: 20000 },
  { id: 'p3', name: '상품3', price: 30000 },
];

//#region Helper
export const createDOMFromLiteral = (literal: string) => {
  return document.createRange().createContextualFragment(literal);
};

export const replaceChildrenFromLiteral = (
  $parentElement: HTMLElement,
  literal: string
) => {
  const $newChildren = createDOMFromLiteral(literal);
  $parentElement.innerHTML = '';
  $parentElement.appendChild($newChildren);
};

export const isDivHTMLElement = (
  targetElement: HTMLElement | null
): targetElement is HTMLDivElement => {
  return targetElement instanceof HTMLDivElement;
};

export const isSelectHTMLElement = (
  targetElement: HTMLElement | null
): targetElement is HTMLSelectElement => {
  return targetElement instanceof HTMLSelectElement;
};

export const isHTMLElement = (
  target: EventTarget | null
): target is HTMLElement => {
  return target instanceof HTMLElement;
};
//#endregion

//#region Templates
export const getProductOptionLiteral = (product: Product) =>
  `<option value="${product.id}">${
    product.name + ' - ' + product.price + '원'
  }</option>`;

export const getMainLayoutLiteral = ({ items }: { items: Product[] }) => {
  let optionLiteral;
  if (items) {
    optionLiteral = items.map((item) => getProductOptionLiteral(item)).join('');
  }

  return `<div class="bg-gray-100 p-8">
    <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
      <h1 class="text-2xl font-bold mb-4">장바구니</h1>
        <div id="cart-items"></div>
        <div id="cart-total" class="text-xl font-bold my-4"></div>
        <select id="product-select" class="border rounded p-2 mr-2">
        ${optionLiteral}
      </select>
        <button id="add-to-cart" class="bg-blue-500 text-white px-4 py-2 rounded">추가</button>
    </div>
  </div>`;
};

export const getCartItemLiteral = (
  cartItem: CartItem
) => `<div class="flex justify-between items-center mb-2">
    <span>${cartItem.product.name} - ${cartItem.product.price}원 x ${cartItem.quantity}</span>
    <div>
      <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${cartItem.product.id}" data-change="-1">-</button>
      <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${cartItem.product.id}" data-change="1">+</button>
      <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${cartItem.product.id}">삭제</button>
    </div>
  </div>`;

export const getCartTotalLiteral = (discountDetail: DiscountDetail) => {
  const discountText =
    discountDetail.discountRate > 0
      ? `(${(discountDetail.discountRate * 100).toFixed(1)}% 할인 적용)`
      : '';

  return `총액: ${Math.round(discountDetail.total)}원
    <span class="text-green-500 ml-2">
      ${discountText}
    </span>
  `;
};

//#endregion

//#region Render
export const reRenderCartItems = (cartItems: CartItem[]) => {
  const $cartItemsContainer = document.getElementById('cart-items');
  if (!isDivHTMLElement($cartItemsContainer)) {
    return;
  }

  const updateCartItemsLiteral = cartItems
    .map((cartItem) => getCartItemLiteral(cartItem))
    .join('');
  replaceChildrenFromLiteral($cartItemsContainer, updateCartItemsLiteral);
};

export const reRenderTotalPrice = () => {
  const { getTotal } = createShoppingCart();
  const $cartTotalPrice = document.getElementById('cart-total');
  if (!isDivHTMLElement($cartTotalPrice)) {
    return;
  }

  const totalDiscountDetail = getTotal();

  const cartTotalLiteral = getCartTotalLiteral(totalDiscountDetail);
  replaceChildrenFromLiteral($cartTotalPrice, cartTotalLiteral);
};

export const createCartView = () => {
  const mainLayoutLiteral = getMainLayoutLiteral({ items: PRODUCTS });

  const $app = document.getElementById('app');
  const $mainLayout = createDOMFromLiteral(mainLayoutLiteral);

  $app?.append($mainLayout);
};

//#endregion

//#region EventListener

export const setEvent = <K extends keyof HTMLElementEventMap>(
  eventType: K,
  targetElementId: string,
  eventFunction: (event: HTMLElementEventMap[K]) => void
) => {
  const $targetElement = document.getElementById(targetElementId);

  if (!$targetElement) {
    return;
  }

  $targetElement.addEventListener(eventType, eventFunction);
};

export const itemButtonsOnClick = (targetHTMLElement: HTMLElement) => {
  const { removeItem, findItem, updateQuantity, getCurrentCartItems } =
    createShoppingCart();

  let targetProductId = targetHTMLElement.dataset.productId;
  if (!targetProductId) {
    return;
  }

  if (targetHTMLElement.closest('.quantity-change')) {
    let changeValue = parseInt(targetHTMLElement.dataset.change as string);
    if (!changeValue) {
      return;
    }

    const currentCartItem = findItem(targetProductId);
    if (!currentCartItem) return;

    const newQuantity = currentCartItem.quantity + changeValue;
    updateQuantity(targetProductId, newQuantity);

    const cartItems = getCurrentCartItems();
    reRenderCartItems(cartItems);
  }

  if (targetHTMLElement.closest('.remove-item')) {
    removeItem(targetProductId);
  }
};

export const appendCartItem = () => {
  const $cartSelectElement = document.getElementById('product-select');
  const $cartItemsContainer = document.getElementById('cart-items');

  if (
    !isSelectHTMLElement($cartSelectElement) ||
    !isDivHTMLElement($cartItemsContainer)
  ) {
    return;
  }

  const { addItem, getCurrentCartItems } = createShoppingCart();
  const selectedProductId = $cartSelectElement.value;

  const selectedProduct = PRODUCTS.find(
    (product) => product.id === selectedProductId
  );
  if (!selectedProduct) {
    return;
  }

  addItem(selectedProduct);

  const cartItems = getCurrentCartItems();

  reRenderCartItems(cartItems);
};

//#endregopm

//#region main Logic
const DISCOUNT_THRESHOLD = 10;
const DISCOUNT_RATES: Record<Product['id'], number> = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
};
const BULK_DISCOUNT_THRESHOLD = 30;
const BULK_DISCOUNT_RATE = 0.25;

let CURRENT_CART_ITMES: CartItem[] = [];

export const createShoppingCart = () => {
  const addItem = (tagetProduct: Product, plusQuantity?: number) => {
    const foundCartItem = findItem(tagetProduct.id);

    if (!foundCartItem) {
      CURRENT_CART_ITMES.push(new CartItem(tagetProduct, plusQuantity));
      return;
    }

    updateQuantity(
      tagetProduct.id,
      foundCartItem.quantity + (plusQuantity ?? 1)
    );
  };

  const removeItem = (targetProductId: string) => {
    CURRENT_CART_ITMES = CURRENT_CART_ITMES.filter(
      (cartItem) => cartItem.product.id !== targetProductId
    );
  };

  const updateQuantity = (targetProductId: string, newQuantity: number) => {
    const foundCartItem = findItem(targetProductId);

    if (!foundCartItem) {
      return;
    }

    if (newQuantity === 0) {
      removeItem(targetProductId);
    }

    foundCartItem.quantity = newQuantity;
  };

  const getCurrentCartItems = () => {
    return CURRENT_CART_ITMES.filter((cartItem) => cartItem.quantity > 0);
  };

  const findItem = (productId: string) => {
    return CURRENT_CART_ITMES.find(
      (cartItem) => cartItem.product.id === productId
    );
  };

  const calculateDiscountAmount = () => {
    return CURRENT_CART_ITMES.reduce((discountAmount, cartItem) => {
      const productPrice = cartItem.product.price * cartItem.quantity;
      const productId = cartItem.product.id;

      if (cartItem.quantity >= DISCOUNT_THRESHOLD) {
        discountAmount += productPrice * DISCOUNT_RATES[productId];
      }

      return discountAmount;
    }, 0);
  };

  const getTotalQuantity = () => {
    return CURRENT_CART_ITMES.reduce((quantity, cartItem) => {
      quantity += cartItem.quantity;
      return quantity;
    }, 0);
  };

  const getTotal = (): DiscountDetail => {
    const totalPrice = CURRENT_CART_ITMES.reduce((totalPrice, cartItem) => {
      totalPrice += cartItem.product.price * cartItem.quantity;
      return totalPrice;
    }, 0);

    const totalQuantity = getTotalQuantity();

    const discountDetail: DiscountDetail = {
      total: 0,
      discountRate: 0,
    };

    if (totalQuantity >= BULK_DISCOUNT_THRESHOLD) {
      discountDetail.total = totalPrice * (1 - BULK_DISCOUNT_RATE);
      discountDetail.discountRate = BULK_DISCOUNT_RATE;
    } else {
      const discountAmount = calculateDiscountAmount();

      const discountTotalPrice = totalPrice - discountAmount;
      const discountRatio = discountTotalPrice / totalPrice;

      discountDetail.total = discountTotalPrice;
      discountDetail.discountRate = 1 - discountRatio;
    }
    return discountDetail;
  };

  const resetCurrentCartItems = () => {
    CURRENT_CART_ITMES = [];
  };

  return {
    addItem,
    removeItem,
    updateQuantity,
    getCurrentCartItems,
    findItem,
    getTotal,
    resetCurrentCartItems,
  };
};

//#endregion

//#region main
function main() {
  const { getCurrentCartItems } = createShoppingCart();
  createCartView();

  setEvent('click', 'cart-items', (event) => {
    if (!isHTMLElement(event.target)) {
      return;
    }
    itemButtonsOnClick(event.target);

    const currentCartItems = getCurrentCartItems();
    reRenderCartItems(currentCartItems);

    reRenderTotalPrice();
  });

  setEvent('click', 'add-to-cart', () => {
    appendCartItem();
    reRenderTotalPrice();
  });
}
//#endregion
main();
