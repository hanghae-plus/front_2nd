import { createShoppingCart } from './createShoppingCart';
import { data as PRODUCTS } from './mocks/products.json';
import { CartItem, CartTotal, MainLayout } from './templates';

export const createCartView = () => {
  const $app = document.getElementById('app');

  $app.innerHTML = MainLayout({ items: PRODUCTS });

  const { addItem, removeItem, updateQuantity, getItems, getTotal } =
    createShoppingCart();

  const $addToCart = document.getElementById('add-to-cart');
  $addToCart.onclick = () => {
    const $productSelect = document.getElementById('product-select');

    const product = PRODUCTS.find(
      product => product.id === $productSelect.value,
    );

    addItem(product);

    updateCart();
  };

  const $cartItems = document.getElementById('cart-items');
  $cartItems.onclick = event => {
    const { classList, dataset } = event.target;

    const isUpdateButton = classList.contains('quantity-change');
    const isRemoveButton = classList.contains('remove-item');

    if (!isUpdateButton && !isRemoveButton) {
      return;
    }
    const { productId } = dataset;

    if (isUpdateButton) {
      const items = getItems();
      const targetItem = items.find(({ product: { id } }) => id === productId);

      updateQuantity(productId, targetItem.quantity + parseInt(dataset.change));
    }

    if (isRemoveButton) {
      removeItem(productId);
    }

    updateCart();
  };

  const updateCart = () => {
    updateCartItems();
    updateCartTotal();
  };

  const updateCartItems = () => {
    const items = getItems();
    const $cartItems = document.getElementById('cart-items');

    let $newCartItems = '';
    items.forEach(item => {
      const $cartItem = CartItem(item);
      $newCartItems += $cartItem;
    });
    $cartItems.innerHTML = $newCartItems;
  };

  const updateCartTotal = () => {
    const { total, discountRate } = getTotal();
    const $cartTotal = document.getElementById('cart-total');

    $cartTotal.innerHTML = CartTotal({ total, discountRate });
  };
};
