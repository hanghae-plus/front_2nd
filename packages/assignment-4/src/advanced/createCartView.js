import { products } from './entities';
import { CartItem, CartTotal, MainLayout, ProductOption } from './templates';

export const createCartView = (cart) => {
  const options = products.map((product) => ProductOption(product)).join('');
  const productOptions = MainLayout({ productOptions: options });

  const $app = document.querySelector('#app');
  $app.innerHTML = productOptions;

  const $productSelect = document.querySelector('#product-select');
  const $addToCart = document.querySelector('#add-to-cart');
  const $cartItems = document.querySelector('#cart-items');
  const $cartTotal = document.querySelector('#cart-total');

  /**cart 업데이트 */
  const updateCart = () => {
    $cartItems.innerHTML = cart
      .getItems()
      .map((item) => CartItem(item))
      .join('');
    $cartTotal.innerHTML = CartTotal(cart.getTotal());
  };

  /**eventListner
   *함수로 따로 뺐어야 했는데... 시간이..
   */
  $addToCart.addEventListener('click', () => {
    const productId = $productSelect.value;
    const product = products.find((p) => p.id === productId);
    cart.addItem(product);
    updateCart();
  });

  $cartItems.addEventListener('click', ({ target }) => {
    const productId = target.dataset.productId;

    if (target.classList.contains('quantity-change')) {
      const change = parseInt(target.dataset.change);
      const item = cart
        .getItems()
        .find((item) => item.product.id === productId);
      cart.updateQuantity(productId, item.quantity + change);
    } else if (target.classList.contains('remove-item')) {
      cart.removeItem(productId);
    }
    updateCart();
  });

  // 초기 카트 업데이트
  updateCart();
};
