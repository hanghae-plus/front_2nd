import { type CartItem } from "../../../types.ts";

export interface Props {
  cartItem: CartItem;
  onClickMinusButtonClick: () => void;
  onClickPlusButtonClick: () => void;
  onClickRemoveButtonClick: () => void;
}

const getAppliedDiscount = (cartItem: CartItem) => {
  const { discounts } = cartItem.product;
  const { quantity } = cartItem;
  let appliedDiscount = 0;
  for (const discount of discounts) {
    if (quantity >= discount.quantity) {
      appliedDiscount = Math.max(appliedDiscount, discount.rate);
    }
  }
  return appliedDiscount;
};

export function CartItem({
  cartItem,
  onClickMinusButtonClick,
  onClickPlusButtonClick,
  onClickRemoveButtonClick,
}: Props) {
  const appliedDiscount = getAppliedDiscount(cartItem);
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
          onClick={onClickMinusButtonClick}
          className="bg-gray-300 text-gray-800 px-2 py-1 rounded mr-1 hover:bg-gray-400"
        >
          -
        </button>
        <button
          onClick={onClickPlusButtonClick}
          className="bg-gray-300 text-gray-800 px-2 py-1 rounded mr-1 hover:bg-gray-400"
        >
          +
        </button>
        <button
          onClick={onClickRemoveButtonClick}
          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
        >
          삭제
        </button>
      </div>
    </div>
  );
}
