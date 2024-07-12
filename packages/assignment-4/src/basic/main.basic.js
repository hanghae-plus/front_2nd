import { initializeCart } from './src/features/cart/components/Cart';
import { PRODUCTS } from './src/shared/constants/product';
import { DISCOUNT_RATES, BULK_DISCOUNT_RATE, BULK_DISCOUNT_THRESHOLD } from './src/shared/constants/discount';

function main() {
  try {
    initializeCart(PRODUCTS, DISCOUNT_RATES, BULK_DISCOUNT_RATE, BULK_DISCOUNT_THRESHOLD);
  } catch (error) {
    console.error('장바구니 초기화 중 오류 발생:', error);
  }
}

main();
