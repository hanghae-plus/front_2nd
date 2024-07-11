import { createShoppingCart } from './createShoppingCart';
import { CartItem, CartTotal, MainLayout } from './templates';

function updateCartUI(items, { total, discountRate }) {
  const cartList = document.getElementById('cart-items');

  if (!cartList) return;

  cartList.innerHTML = '';

  items.forEach(tmp => {
    const itemElement = CartItem(tmp);

    cartList.innerHTML += itemElement;
  });

  cartList.insertAdjacentHTML('afterend', CartTotal({ total, discountRate }));
}

export const createCartView = items => {
  const app = document.getElementById('app');

  if (!app) return;

  const useShoppingCart = createShoppingCart();

  app.innerHTML = MainLayout({ items });

  const handleAddClick = event => {
    const selectElement = document.getElementById('product-select');

    if (!selectElement) return;

    const selectedItem = items.find(
      product => product.id === selectElement.value
    );

    useShoppingCart.addItem(selectedItem);
    console.log(useShoppingCart.getItems());
    updateCartUI(useShoppingCart.getItems(), useShoppingCart.getTotal());
  };

  const handleCartClick = event => {
    const target = event.target;

    if (!target) return;

    // @ts-ignore
    const action = target.dataset.action;
    // @ts-ignore
    const productId = target.dataset.productId;
    const clicked = useShoppingCart
      .getItems()
      .find(({ product }) => product.id === productId);

    switch (action) {
      case 'increase':
        useShoppingCart.updateQuantity(productId, clicked.quantity + 1);
        break;
      case 'decrease':
        useShoppingCart.updateQuantity(productId, clicked.quantity - 1);
        break;
      case 'remove':
        useShoppingCart.removeItem(productId);
        break;
      default:
        return;
    }

    updateCartUI(useShoppingCart.getItems(), useShoppingCart.getTotal());
  };

  document.getElementById('add-to-cart').onclick = handleAddClick;
  document.getElementById('cart-items').onclick = handleCartClick;
};
