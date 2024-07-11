import { MainLayout, CartItem, CartTotal } from './templates.js';

export const createCartView = (cart, products) => {
  const app = document.getElementById('app');

  const render = () => {
    const cartItems = cart.getItems();
    const cartItemsElement = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');

    if (!cartItemsElement) {
      app.innerHTML = MainLayout({ items: products });
    }

    const updatedCartItemsElement = document.getElementById('cart-items');
    updatedCartItemsElement.innerHTML = cartItems.map(item => CartItem(item)).join('');
    
    const updatedCartTotalElement = document.getElementById('cart-total');
    updatedCartTotalElement.innerHTML = CartTotal(cart.getTotal());
  };

  const addToCart = () => {
    const select = document.getElementById('product-select');
    const selectedProduct = products.find(p => p.id === select.value);
    cart.addItem(selectedProduct, 1);
    setTimeout(() => render(), 0); 
  };

  const handleCartItemAction = (event) => {
    const target = event.target;
    if (target.classList.contains('quantity-change') || target.classList.contains('remove-item')) {
      const productId = target.dataset.productId;
      if (target.classList.contains('quantity-change')) {
        const change = parseInt(target.dataset.change);
        const currentItem = cart.getItems().find(item => item.product.id === productId);
        cart.updateQuantity(productId, currentItem.quantity + change);
      } else if (target.classList.contains('remove-item')) {
        cart.removeItem(productId);
      }
      setTimeout(() => render(), 0);  
    }
  };

  const initialize = () => {
    render();
    document.getElementById('add-to-cart').addEventListener('click', addToCart);
    app.addEventListener('click', handleCartItemAction);
  };

  return { initialize };
};
