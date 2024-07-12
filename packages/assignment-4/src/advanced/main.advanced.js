import { createCartView } from './createCartView';

const PRODUCTS = [
  { id: 'p1', name: '상품1', price: 10000, discount: [[10, 0.1]] },
  { id: 'p2', name: '상품2', price: 20000, discount: [[10, 0.15]] },
  { id: 'p3', name: '상품3', price: 30000, discount: [[10, 0.2]] }
];

function main() {
  createCartView(PRODUCTS);
}

main();
