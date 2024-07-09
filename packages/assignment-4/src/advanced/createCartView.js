import { createShoppingCart } from './createShoppingCart.js';
import { MainLayout, CartItem, CartTotal } from './templates.js';

/**
 * 장바구니 뷰를 생성
 * @param {HTMLElement} 루트 요소
 * @param {{ productId: string; productName: string; price: number; discount: [[number, number]]}[]} products
 * @returns {object} 장바구니 뷰 업데이트 메서드 (renderCartItems, renderCartTotal)
 */
export const createCartView = (root, products) => {
  root.innerHTML = MainLayout(products);

  const { addItem, removeItem, updateQuantity, getTotal, getItems } = createShoppingCart();

  // 최초 items 등록
  products.forEach((product) => addItem(product, 0));

  // appRoute에 이벤트 위임
  root.addEventListener('click', (event) => {
    const { className, dataset, id } = event.target;
    // +, - 버튼 : dataset.change에 -1 또는 1이 들어있음
    if (className.includes('quantity-change')) {
      updateQuantity(dataset.productId, Number(dataset.change));
      return;
    }

    // 삭제 버튼
    if (className.includes('remove-item')) {
      removeItem(dataset.productId);
      return;
    }

    // 추가 버튼
    if (id === 'add-to-cart') {
      const productSelect = root.querySelector('#product-select');
      const selectedProductId = productSelect.value;
      const product = products.find(({ productId }) => productId === selectedProductId);
      addItem(product);
      return;
    }
  });

  // cartItems 렌더링
  const cartItems = root.querySelector('#cart-items');
  const renderCartItems = () => {
    const items = getItems();
    cartItems.innerHTML = items
      .filter(({ quantity }) => quantity > 0)
      .map(({ product, quantity }) => CartItem({ product, quantity }))
      .join('');
  };

  // cartTotal 렌더링
  const cartTotal = root.querySelector('#cart-total');
  const renderCartTotal = () => {
    const { total, discountRate } = getTotal();
    cartTotal.innerHTML = CartTotal({ total, discountRate });
  };

  return { renderCartItems, renderCartTotal };
};
