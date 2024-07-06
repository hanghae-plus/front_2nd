import { getCurrentCartItems, updateCartItems } from './localStorage.js';

const DISCOUNT_RATES = {
  // 상품별 10개 이상일 시 할인율
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
  isQuantityGreaterThanOrEqual30: 0.25,
};

const products = [
  {
    productId: 'p1',
    productName: '상품1',
    price: 10000,
  },
  {
    productId: 'p2',
    productName: '상품2',
    price: 20000,
  },
  {
    productId: 'p3',
    productName: '상품3',
    price: 30000,
  },
];

function updateTotalPrice() {
  const currentCartItems = getCurrentCartItems();
  const productIdsInCart = Object.keys(currentCartItems);
  const totalQuantity = productIdsInCart.reduce((sum, productId) => sum + currentCartItems[productId].quantity, 0);
  // 할인 적용 전 총액
  const totalPriceBeforeDiscount = productIdsInCart.reduce((sum, productId) => {
    const { price, quantity } = currentCartItems[productId];
    return sum + price * quantity;
  }, 0);
  const totalPrice =
    totalQuantity >= 30
      ? totalPriceBeforeDiscount * (1 - DISCOUNT_RATES.isQuantityGreaterThanOrEqual30)
      : productIdsInCart.reduce((sum, productId) => {
          const { price, quantity } = currentCartItems[productId];
          const discountRate = quantity >= 10 ? DISCOUNT_RATES[productId] : 0;
          return sum + price * quantity * (1 - discountRate);
        }, 0);
  const appliedDiscountRate = 1 - totalPrice / totalPriceBeforeDiscount;

  const cartTotalElement = document.querySelector('#cart-total');
  cartTotalElement.innerHTML = `총액: ${totalPrice}원${
    appliedDiscountRate > 0
      ? `
        <span class="text-green-500 ml-2">(${(appliedDiscountRate * 100).toFixed(1)}% 할인 적용)</span>`
      : `
    `
  }`;
}

function createCartItemElement({ productId, productName, price, quantity }) {
  const element = document.createElement('div');
  element.id = productId;
  element.className = 'flex justify-between items-center mb-2';
  element.innerHTML = `
            <span>${productName} - ${price}원 x ${quantity}</span>
            <div>
                <button 
                    class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
                    data-product-id="${productId}"
                    data-change="-1"
                >-</button>
                <button
                    class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
                    data-product-id="${productId}"
                    data-change="1"
                >+</button>
                <button 
                    class="remove-item bg-red-500 text-white px-2 py-1 rounded" 
                    data-product-id="${productId}"
                >삭제</button>
            </div>
    `;
  return element;
}

function updateCart() {
  const currentCartItems = getCurrentCartItems();

  const cartItemsElement = document.querySelector('#cart-items');
  const currentCartItemElements = [...cartItemsElement.children];
  const currentRenderedProductIds = currentCartItemElements.map((cartItemElement) => cartItemElement.id);
  const productIdsInCurrentCart = Object.keys(currentCartItems);

  // 렌더링된 프로덕트이지만 현재 카트에 없는 경우 제거
  const removedProductIds = currentRenderedProductIds.filter(
    (productId) => !productIdsInCurrentCart.includes(productId),
  );
  removedProductIds.forEach((productId) => {
    const removedElement = currentCartItemElements.find((cartItemElement) => cartItemElement.id === productId);
    removedElement.remove();
  });

  // Update and Insert
  productIdsInCurrentCart.forEach((productId) => {
    // 수량이 변경된 경우
    const elementWithProductId = currentCartItemElements.find((cartItemElement) => cartItemElement.id === productId);
    // 새로운 프로덕트인 경우
    if (!elementWithProductId) {
      const newCartItemElement = createCartItemElement({
        productId,
        productName: currentCartItems[productId].productName,
        price: currentCartItems[productId].price,
        quantity: currentCartItems[productId].quantity,
      });
      const position = currentRenderedProductIds.findIndex((currentProductId) => {
        const currentProductIdInNumber = parseInt(currentProductId.split('product')[1], 10);
        const productIdInNumber = parseInt(productId.split('product')[1], 10);
        return currentProductIdInNumber > productIdInNumber;
      });
      if (position === -1) {
        cartItemsElement.appendChild(newCartItemElement);
      } else {
        cartItemsElement.insertBefore(newCartItemElement, currentCartItemElements[position]);
      }
    }

    if (elementWithProductId) {
      const currentQuantity = parseInt(elementWithProductId.querySelector('span').textContent.split('x ')[1], 10);
      if (currentQuantity !== currentCartItems[productId].quantity) {
        elementWithProductId.querySelector('span').textContent = `${currentCartItems[productId].productName} - ${
          currentCartItems[productId].price
        }원 x ${currentCartItems[productId].quantity}`;
      }
    }
  });
}

function decreaceQuantity(productId) {
  const currentCartItems = getCurrentCartItems();
  const newCartItems = structuredClone(currentCartItems);
  if (currentCartItems[productId].quantity > 1) {
    newCartItems[productId].quantity -= 1;
  } else {
    delete newCartItems[productId];
  }
  updateCartItems(newCartItems);
  updateTotalPrice();
  updateCart();
}

function increaseQuantity(productId) {
  const currentCartItems = getCurrentCartItems();
  const newCartItems = structuredClone(currentCartItems);
  newCartItems[productId].quantity += 1;
  updateCartItems(newCartItems);
  updateTotalPrice();
  updateCart();
}

function removeItemFromCart(productId) {
  const currentCartItems = getCurrentCartItems();
  const newCartItems = structuredClone(currentCartItems);
  delete newCartItems[productId];
  updateCartItems(newCartItems);
  updateTotalPrice();
  updateCart();
}

function addItemToCart() {
  const productSelect = document.querySelector('#product-select');
  const selectedProductId = productSelect.value;
  const selectedProduct = products.find(({ productId }) => productId === selectedProductId);

  const currentCartItems = getCurrentCartItems();
  const newCartItems = structuredClone(currentCartItems);
  if (currentCartItems[selectedProductId]) {
    // 이미 추가된 상품인 경우
    newCartItems[selectedProductId].quantity += 1;
  } else {
    // 최초 추가시
    newCartItems[selectedProductId] = {
      ...selectedProduct,
      quantity: 1,
    };
  }
  updateCartItems(newCartItems);
  updateTotalPrice();
  updateCart();
}

function attachEventListeners() {
  const appRoute = document.querySelector('#app');
  appRoute.addEventListener('click', (event) => {
    const { className, dataset, id } = event.target;
    // +, - 버튼
    if (className.includes('quantity-change')) {
      dataset.change === '1' ? increaseQuantity(dataset.productId) : decreaceQuantity(dataset.productId);
    }
    // 삭제 버튼
    if (className.includes('remove-item')) {
      removeItemFromCart(dataset.productId);
    }
    // 추가 버튼
    if (id === 'add-to-cart') {
      addItemToCart();
    }
  });
}

function renderProductOptions() {
  const productSelect = document.querySelector('#product-select');

  // products가 변경되면 자동으로 옵션들이 바뀔 수 있게
  products.forEach(({ productId, productName, price }) => {
    const option = document.createElement('option');
    option.value = productId;
    option.textContent = `${productName} - ${price}원`;
    productSelect.appendChild(option);
  });
}

function createAppTemplate() {
  return `<div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
          <h1 class="text-2xl font-bold mb-4">장바구니</h1>
          <div id="cart-items"></div>
          <div id="cart-total" class="text-xl font-bold my-4"></div>
          <select id="product-select" class="border rounded p-2 mr-2"></select>
          <button id="add-to-cart" class="bg-blue-500 text-white px-4 py-2 rounded">추가</button>
        </div>`;
}

function main() {
  const appRoute = document.querySelector('#app');
  // appRoute에 정적인 템플릿을 렌더링
  appRoute.innerHTML = createAppTemplate();

  // products에 따라 select의 option들을 렌더링
  renderProductOptions();

  // root에 필요한 이벤트 리스너들을 추가
  attachEventListeners();
}

main();
