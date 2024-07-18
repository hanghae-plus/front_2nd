import { type CartItem } from "../../types.ts";
import { getMaxApplicableDiscount } from "../utils/cartUtils.ts";
import { MouseEventHandler } from "react";

export interface Props {
  cartItem: CartItem;
  onClickMinusButton: MouseEventHandler<HTMLButtonElement>;
  onClickPlusButton: MouseEventHandler<HTMLButtonElement>;
  onClickRemoveButton: MouseEventHandler<HTMLButtonElement>;
}

export function CartItem({
  cartItem,
  onClickMinusButton,
  onClickPlusButton,
  onClickRemoveButton,
}: Props) {
  const appliedDiscount = getMaxApplicableDiscount(cartItem);
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
          onClick={onClickMinusButton}
          className="bg-gray-300 text-gray-800 px-2 py-1 rounded mr-1 hover:bg-gray-400"
        >
          -
        </button>
        <button
          onClick={onClickPlusButton}
          className="bg-gray-300 text-gray-800 px-2 py-1 rounded mr-1 hover:bg-gray-400"
        >
          +
        </button>
        <button
          onClick={onClickRemoveButton}
          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
        >
          삭제
        </button>
      </div>
    </div>
  );
}
