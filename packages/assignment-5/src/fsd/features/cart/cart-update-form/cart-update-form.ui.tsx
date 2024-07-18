import { useStore } from 'zustand';
import { CartItem, cartStore } from '~entities/cart';
import { calculateAppliedDiscount } from './cart-update-form.model';

type CartUpdateFormProps = {
  cartItem: CartItem;
};

export function CartUpdateForm({ cartItem }: CartUpdateFormProps) {
  const { updateQuantity, removeFromCart } = useStore(cartStore, (state) => ({
    updateQuantity: state.updateQuantity,
    removeFromCart: state.removeFromCart,
  }));

  const appliedDiscount = calculateAppliedDiscount(cartItem);

  const handleDecreaseClick = (productId: string, newQuantity: number) => {
    updateQuantity(productId, newQuantity);
  };
  const handleIncreaseClick = (productId: string, newQuantity: number) => {
    updateQuantity(productId, newQuantity);
  };

  const handleDeleteButtonClick = (productId: string) => {
    removeFromCart(productId);
  };

  const props: CartUpdateFormViewProps = {
    cartItem: cartItem,
    appliedDiscount: appliedDiscount,
    handleDecreaseClick: handleDecreaseClick,
    handleIncreaseClick: handleIncreaseClick,
    handleDeleteButtonClick: handleDeleteButtonClick,
  };

  return <CartUpdateFormView {...props} />;
}

type CartUpdateFormViewProps = {
  cartItem: CartItem;
  appliedDiscount: number;
  handleDecreaseClick: (productId: string, newQuantity: number) => void;
  handleIncreaseClick: (productId: string, newQuantity: number) => void;
  handleDeleteButtonClick: (productId: string) => void;
};

function CartUpdateFormView({
  cartItem,
  appliedDiscount,
  handleDecreaseClick,
  handleIncreaseClick,
  handleDeleteButtonClick,
}: CartUpdateFormViewProps) {
  return (
    <div
      key={cartItem.product.id}
      className="flex justify-between cartItems-center bg-white p-3 rounded shadow"
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
        </span>
      </div>
      <div>
        <button
          onClick={() =>
            handleDecreaseClick(cartItem.product.id, cartItem.quantity - 1)
          }
          className="bg-gray-300 text-gray-800 px-2 py-1 rounded mr-1 hover:bg-gray-400"
        >
          -
        </button>
        <button
          onClick={() =>
            handleIncreaseClick(cartItem.product.id, cartItem.quantity + 1)
          }
          className="bg-gray-300 text-gray-800 px-2 py-1 rounded mr-1 hover:bg-gray-400"
        >
          +
        </button>
        <button
          onClick={() => handleDeleteButtonClick(cartItem.product.id)}
          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
        >
          삭제
        </button>
      </div>
    </div>
  );
}
