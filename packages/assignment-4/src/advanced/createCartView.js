export const createCartView = (cart, templates, products) => {
  const { MainLayout, ProductOption, CartItem, CartTotal } = templates;

  const render = (container) => {
    container.innerHTML = MainLayout({ items: products });
    const productSelect = container.querySelector('#product-select');
    const addButton = container.querySelector('#add-to-cart');
    const cartItemsContainer = container.querySelector('#cart-items');
    const cartTotalContainer = container.querySelector('#cart-total');

    const renderCartItems = () => {
      cartItemsContainer.innerHTML = cart.getItems().map(CartItem).join('');
    };

    const renderCartTotal = () => {
      const { total, discountRate } = cart.getTotal();
      cartTotalContainer.innerHTML = CartTotal({ total, discountRate });
    };

    const renderProductOptions = () => {
      productSelect.innerHTML = products.map(ProductOption).join('');
    };

    const renderCart = () => {
      renderCartItems();
      renderCartTotal();
    };

    addButton.addEventListener('click', () => {
      const selectedProduct = products.find(
        (p) => p.id === productSelect.value
      );
      if (selectedProduct) {
        cart.addItem(selectedProduct);
        renderCart();
      }
    });

    cartItemsContainer.addEventListener('click', (event) => {
      const target = event.target;
      if (target.classList.contains('quantity-change')) {
        const productId = target.dataset.productId;
        const nextChange =
          cart.findItem(productId).quantity + parseInt(target.dataset.change);
        cart.updateQuantity(productId, nextChange);
      } else if (target.classList.contains('remove-item')) {
        const productId = target.dataset.productId;
        cart.removeItem(productId);
      }
      renderCart();
    });

    return {
      renderCart,
      renderProductOptions,
    };
  };

  return { render };
};
