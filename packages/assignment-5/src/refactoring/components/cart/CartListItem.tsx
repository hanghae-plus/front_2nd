import { CartItem } from '../../../types';
import { useRemainCount } from '../../hooks/useRemainCount';

interface Props {
  cartItem: CartItem;
  appliedDiscount: number;
  updateQuantity: (productId: string, newQuantity: number) => void;
  removeFromCart: (productId: string) => void;
}
export const CartListItem = ({
  cartItem,
  appliedDiscount,
  updateQuantity,
  removeFromCart,
}: Props) => {
  const { calcRemain } = useRemainCount();

  return (
    <div
      key={cartItem.product.id}
      className="flex justify-between items-center bg-white p-3 rounded shadow"
    >
      <div>
        <span className="font-semibold">{cartItem.product.name}</span>
        <br />
        <span className="text-sm text-gray-600">
          {cartItem.product.price}원 x {cartItem.quantity}
          {appliedDiscount > 0 && (
            <span className="text-green-600 ml-1">
              ({(appliedDiscount * 100).toFixed(0)}% 할인 적용)
            </span>
          )}
          <span className="text-blue-600 ml-1">
            (다음 할인까지 {calcRemain(cartItem)}개 남음)
          </span>
        </span>
      </div>
      <div>
        <button
          onClick={() =>
            updateQuantity(cartItem.product.id, cartItem.quantity - 1)
          }
          className="bg-gray-300 text-gray-800 px-2 py-1 rounded mr-1 hover:bg-gray-400"
        >
          -
        </button>
        <button
          onClick={() =>
            updateQuantity(cartItem.product.id, cartItem.quantity + 1)
          }
          className="bg-gray-300 text-gray-800 px-2 py-1 rounded mr-1 hover:bg-gray-400"
        >
          +
        </button>
        <button
          onClick={() => removeFromCart(cartItem.product.id)}
          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
        >
          삭제
        </button>
      </div>
    </div>
  );
};
