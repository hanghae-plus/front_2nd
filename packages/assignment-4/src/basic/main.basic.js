import './src/components/CartComponent';

/**
 * 메인 함수
 */
function main() {
  const $app = document.getElementById('app');
  const $cart = document.createElement('cart-component');
  $app.appendChild($cart);
}

main();
