import { CartItem, Coupon, Product } from '../../types.ts';
import { useCart, useLocalStorage } from '../hooks';
import ProductList from './ProductList.tsx';
import CartProduct from './CartProduct.tsx';

interface Props {
  products: Product[];
  coupons: Coupon[];
}

export const CartPage = ({ products, coupons }: Props) => {
  const {
    cart,
    setCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateTotal,
    selectedCoupon,
    applyMember,
    selectedMember,
  } = useCart();

  useLocalStorage('myCart', cart, setCart);

  const { totalBeforeDiscount, totalAfterDiscount, totalDiscount } =
    calculateTotal();

  const getAppliedDiscount = (item: CartItem) => {
    const { discounts } = item.product;
    const { quantity } = item;
    let appliedDiscount = 0;
    for (const discount of discounts) {
      if (quantity >= discount.quantity) {
        appliedDiscount = Math.max(appliedDiscount, discount.rate);
      }
    }
    return appliedDiscount;
  };

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-6'>장바구니</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <ProductList products={products} cart={cart} addToCart={addToCart} />
        <div>
          <h2 className='text-2xl font-semibold mb-4'>장바구니 내역</h2>

          <div className='space-y-2'>
            {cart.map((item) => (
              <CartProduct
                key={item.product.id}
                item={item}
                appliedDiscount={getAppliedDiscount(item)}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
              />
            ))}
          </div>

          <div className='mt-6 bg-white p-4 rounded shadow'>
            <h2 className='text-2xl font-semibold mb-2'>쿠폰 적용</h2>
            <select
              onChange={(e) => applyCoupon(coupons[parseInt(e.target.value)])}
              className='w-full p-2 border rounded mb-2'
            >
              <option value=''>쿠폰 선택</option>
              {coupons.map((coupon, index) => (
                <option key={coupon.code} value={index}>
                  {coupon.name} -{' '}
                  {coupon.discountType === 'amount'
                    ? `${coupon.discountValue}원`
                    : `${coupon.discountValue}%`}
                </option>
              ))}
            </select>
            {selectedCoupon && (
              <p className='text-green-600'>
                적용된 쿠폰: {selectedCoupon.name}(
                {selectedCoupon.discountType === 'amount'
                  ? `${selectedCoupon.discountValue}원`
                  : `${selectedCoupon.discountValue}%`}{' '}
                할인)
              </p>
            )}
          </div>

          <div className='mt-6 bg-white p-4 rounded shadow'>
            <h2 className='text-2xl font-semibold mb-2'>주문 요약</h2>
            <div className='space-y-1'>
              <p>상품 금액: {totalBeforeDiscount.toLocaleString()}원</p>
              <p className='text-green-600'>
                할인 금액: {totalDiscount.toLocaleString()}원
              </p>
              <p className='text-xl font-bold'>
                최종 결제 금액: {totalAfterDiscount.toLocaleString()}원
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
