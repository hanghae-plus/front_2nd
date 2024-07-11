import { createCartItemHTML, updateCartDisplay } from '../components/CartItem';
import { extractCartItemsData } from '../utils/cartUtils';

export function createCartService(products, discountService) {
  function findProduct(productId) {
    return products.find((product) => product.id === productId);
  }

  function updateCart(elements) {
    const cartItemsData = extractCartItemsData(elements.cartItems.children, findProduct);
    const cartResult = discountService.calculateCart(cartItemsData);
    updateCartDisplay(elements.cartTotal, cartResult);
  }

  function updateItemQuantity(item, change) {
    const quantitySpan = item.querySelector('span');
    const [productInfo, currentQuantity] = quantitySpan.textContent.split('x ');
    const newQuantity = parseInt(currentQuantity, 10) + change;

    if (newQuantity > 0) {
      quantitySpan.textContent = `${productInfo}x ${newQuantity}`;
      return;
    }

    item.remove();
  }

  function handleCartItemActions(event, elements) {
    const { target } = event;

    if (!target.classList.contains('quantity-change') && !target.classList.contains('remove-item')) {
      return;
    }

    const { productId } = target.dataset;
    const item = document.getElementById(productId);

    if (!item) {
      console.error(`상품 아이템을 찾을 수 없습니다: ${productId}`);
      return;
    }

    if (target.classList.contains('quantity-change')) {
      const change = parseInt(target.dataset.change, 10);
      updateItemQuantity(item, change);
    } else if (target.classList.contains('remove-item')) {
      item.remove();
    }

    updateCart(elements);
  }

  function addToCart(elements) {
    const { value } = elements.productSelect;
    const selectedProduct = findProduct(value);
    if (!selectedProduct) return;

    const existingItem = document.getElementById(selectedProduct.id);
    if (existingItem) {
      const quantitySpan = existingItem.querySelector('span');
      const quantity = parseInt(quantitySpan.textContent.split('x ')[1], 10) + 1;
      quantitySpan.textContent = `${selectedProduct.name} - ${selectedProduct.price}원 x ${quantity}`;
    } else {
      const cartItemHTML = createCartItemHTML(selectedProduct, 1);
      elements.cartItems.insertAdjacentHTML('beforeend', cartItemHTML);
    }

    updateCart(elements);
  }

  return {
    addToCart,
    updateCart,
    handleCartItemActions,
  };
}
