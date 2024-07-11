import { MainLayout } from './templates';
import { createShoppingCart } from './createShoppingCart';
import { createCartView } from './createCartView';

function main() {
  const PRODUCTS = [
    { id: 'p1', name: '상품1', price: 10000, discount: [[10, 0.1]] },
    { id: 'p2', name: '상품2', price: 20000, discount: [[10, 0.15]] },
    { id: 'p3', name: '상품3', price: 30000, discount: [[10, 0.2]] },
  ];

  const app = document.getElementById('app');
  app.innerHTML = MainLayout({ items: PRODUCTS });

  const cart = createShoppingCart();
  const cartView = createCartView(cart);

  const productSelect = document.getElementById('product-select');
  const addButton = document.getElementById('add-to-cart');

  addButton.addEventListener('click', () => {
    const selectedProductId = productSelect.value;
    const selectedProduct = PRODUCTS.find((p) => p.id === selectedProductId);
    cart.addItem(selectedProduct);
    cartView.updateCart();
  });
  cartView.updateCart();
}

main();
