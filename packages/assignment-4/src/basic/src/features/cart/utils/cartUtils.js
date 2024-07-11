import { PRODUCTS } from '../../../shared/constants/product';

export function extractCartItemsData(cartItemElements) {
  return Array.from(cartItemElements).map((item) => {
    const product = PRODUCTS.find((p) => p.id === item.id);
    const quantity = parseInt(item.querySelector('span').textContent.split('x ')[1], 10);
    return {
      id: product.id,
      price: product.price,
      quantity,
    };
  });
}
