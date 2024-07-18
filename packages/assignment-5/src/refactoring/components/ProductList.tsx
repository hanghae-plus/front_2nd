import { Product } from '../../types.ts';
import { useProductSearch } from '../hooks/index.js';
import ProductSearch from './ProductSearch.tsx';
import ProductItem from './ProductItem.tsx';

export default function ProductList({ products, cart, addToCart }) {
  const { setSearchValue, filteredData } = useProductSearch(products);

  const getMaxDiscount = (discounts: { quantity: number; rate: number }[]) => {
    return discounts.reduce((max, discount) => Math.max(max, discount.rate), 0);
  };

  const getRemainingStock = (product: Product) => {
    const cartItem = cart.find((item) => item.product.id === product.id);
    return product.stock - (cartItem?.quantity || 0);
  };

  return (
    <div>
      <ProductSearch setSearchValue={setSearchValue} />
      <h2 className='text-2xl font-semibold mb-4'>상품 목록</h2>
      <div className='space-y-2'>
        {filteredData.length === 0 ? (
          <p>요청하신 제품을 찾을 수 없습니다.</p>
        ) : (
          filteredData.map((product) => (
            <ProductItem
              key={product.id}
              product={product}
              maxDiscount={getMaxDiscount(product.discounts)}
              remainingStock={getRemainingStock(product)}
              addToCart={addToCart}
            />
          ))
        )}
      </div>
    </div>
  );
}
