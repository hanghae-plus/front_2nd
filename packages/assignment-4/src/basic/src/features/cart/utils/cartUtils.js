// packages/assignment-4/src/features/cart/utils/cartUtils.js
export function extractCartItemsData(cartItemElements, findProduct) {
  return Array.from(cartItemElements).map((item) => {
    const product = findProduct(item.id);
    const quantity = parseInt(item.querySelector('span').textContent.split('x ')[1], 10);
    return {
      id: product.id,
      price: product.price,
      quantity,
    };
  });
}
