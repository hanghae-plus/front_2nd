import { MainLayout, CartItem, CartTotal } from './templates.js';

export const createCartView = (cart, products) => {
  const app = document.getElementById('app');

  const render = () => {
    const items = cart.getItems();
    const { total, discountRate } = cart.getTotal();

    app.innerHTML = MainLayout({ items: products });

    document.getElementById('cart-items').innerHTML = items
      .map(CartItem)
      .join('');
    document.getElementById('cart-total').outerHTML = CartTotal({
      total,
      discountRate,
    });

    setupEventListeners();
  };

  const setupEventListeners = () => {
    const addButton = document.getElementById('add-to-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const productSelect = document.getElementById('product-select');

    addButton.onclick = () => {
      const selectedProductId = productSelect.value;
      const selectedProduct = products.find((p) => p.id === selectedProductId);
      cart.addItem(selectedProduct);
      render();
    };

    cartItemsContainer.onclick = (event) => {
      const target = event.target;
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
      render();
    };
  };

  return { render };
};
