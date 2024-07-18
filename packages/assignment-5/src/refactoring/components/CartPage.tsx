import { Coupon, Product } from '../../types.ts';
import { useCart, useLocalStorage } from '../hooks';
import ProductList from './ProductList.tsx';
import CartList from './CartList.tsx';

interface Props {
  products: Product[];
  coupons: Coupon[];
}

export const CartPage = ({ products, coupons }: Props) => {
  const { cart, setCart, addToCart, removeFromCart, updateQuantity } =
    useCart();
  useLocalStorage('myCart', cart, setCart);

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-6'>장바구니</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <ProductList products={products} cart={cart} addToCart={addToCart} />
        <CartList
          coupons={coupons}
          cart={cart}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
        />
      </div>
    </div>
  );
};
