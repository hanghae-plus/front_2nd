import { MainLayout, CartItem, CartTotal } from './templates.js';
export const createCartView = (items) => {
  // 최초 메인 레이아웃 렌더링
  const $app = document.getElementById('app');
  $app.insertAdjacentHTML('beforeend', MainLayout({ items }));

  // 장바구니 리스트 이전 상태
  let prevCartList = null;

  function copyCartList(cartList) {
    return cartList.map((item) => {
      return { product: { ...item.product }, quantity: item.quantity };
    });
  }

  // 장바구니 리스트 화면 업데이트
  function updateCart(cartList) {
    const $cartItems = document.getElementById('cart-items');
    // 장바구니 리스트 최초 렌더링
    if (prevCartList === null) {
      $cartItems.insertAdjacentHTML(
        'beforeend',
        cartList.map((data) => CartItem(data)).join('')
      );

      prevCartList = copyCartList(cartList);

      return;
    }

    const maxlength = Math.max(prevCartList.length, cartList.length);

    for (let i = 0; i < maxlength; i++) {
      const prevItem = prevCartList[i];
      const newItem = cartList[i];
      const $target = $cartItems.children[i];

      // 이전 리스트에 없는 새로운 아이템 추가
      if (!prevItem) {
        $cartItems.insertAdjacentHTML('beforeend', CartItem(newItem));
        break;
      }
      // 리스트에서 아이템 삭제
      if (!newItem) {
        $target.remove();
        break;
      }
      // 아이템 정보 변경
      if (
        prevItem.product.id !== newItem.product.id ||
        prevItem.quantity !== newItem.quantity
      ) {
        $target.insertAdjacentHTML('afterend', CartItem(newItem));
        $target.remove();
      }
    }

    // 신규 장바구니 리스트를 이전 장바구니 리스트에 저장
    prevCartList = copyCartList(cartList);
  }

  // 장바구니 총액 화면 업데이트
  function updateTotal(total) {
    const $cartTotal = document.getElementById('cart-total');
    $cartTotal.innerHTML = CartTotal(total);
  }

  // 전체 화면 업데이트
  function updateCartView({ cartList, total }) {
    updateCart(cartList);
    updateTotal(total);
  }

  return updateCartView;
};
