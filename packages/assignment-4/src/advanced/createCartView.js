import {createShoppingCart } from './createShoppingCart';
import { CartItem, CartTotal, MainLayout } from './templates';

export const createCartView = items => {
  const app = document.getElementById('app');

  if (!app) return;

  const useCart = createShoppingCart();

  app.innerHTML = MainLayout({ items });

  // #region 이벤트 핸들러 등록
  document.getElementById('add-to-cart').addEventListener('click', event => {
    const selectElement = document.getElementById('product-select');

    if (!selectElement) return;

    const selectedItem = items.find(
      product => product.id === selectElement.value
    );

    useCart.addItem(selectedItem);
    updateCartItemsUI();
  })

  document.getElementById('cart-items').addEventListener('click', event => {
    const target = event.target;

    if (!target) return;

    const action = target.dataset.action;
    const productId = target.dataset.productId;

    const clickedItem = useCart
      .getItems()
      .find(({ product }) => product.id === productId);

    switch (action) {
      case 'increase':
        useCart.updateQuantity(productId, clickedItem.quantity + 1);
        break;
      case 'decrease':
        useCart.updateQuantity(productId, clickedItem.quantity - 1);
        break;
      case 'remove':
        useCart.removeItem(productId);
        break;
      default:
        return;
    }

    updateCartItemsUI();
  })
  // #endregion

  // #region 함수
  /** 장바구니 상품 목록 업데이트 함수 */
  function updateCartItemsUI() {
    const cartList = document.getElementById('cart-items');
  
    if (!cartList) return;
  
    const {total, discountRate} = useCart.getTotal();
    
    cartList.innerHTML = '';
  
    useCart.getItems().forEach(tmp => {
      const itemElement = CartItem(tmp);
  
      cartList.innerHTML += itemElement;
    });
  
    cartList.insertAdjacentHTML('afterend', CartTotal({ total, discountRate }));
  }
  // #endregion
};
