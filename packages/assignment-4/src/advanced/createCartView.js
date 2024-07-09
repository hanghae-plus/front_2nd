import { createShoppingCart } from './createShoppingCart.js';
import { MainLayout, CartItem, CartTotal } from './templates.js';

/**
 * @param {NodeElement} root
 * @param {{ productId: string; productName: string; price: number; discount: [[number, number]]}[]} products
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
      updateQuantity(dataset.productId, +dataset.change);
    }

    // 삭제 버튼
    if (className.includes('remove-item')) {
      removeItem(dataset.productId);
    }

    // 추가 버튼
    if (id === 'add-to-cart') {
      const productSelect = root.querySelector('#product-select');
      const selectedProductId = productSelect.value;
      const product = products.find(({ productId }) => productId === selectedProductId);
      addItem(product);
    }
  });

  // cartItems 렌더링
  const cartItems = root.querySelector('#cart-items');
  const renderCartItems = () => {
    const items = getItems();
    cartItems.innerHTML = '';
    items.forEach(({ product: { productId, productName, price }, quantity }) => {
      cartItems.innerHTML += CartItem({ product: { productId, productName, price }, quantity });
    });
  };

  // cartTotal 렌더링
  const cartTotal = root.querySelector('#cart-total');
  const renderCartTotal = () => {
    const { total, discountRate } = getTotal();
    cartTotal.innerHTML = CartTotal({ total, discountRate });
  };

  return { renderCartItems, renderCartTotal };
};
