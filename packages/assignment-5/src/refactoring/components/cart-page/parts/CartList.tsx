import { CartItem as TCartItem } from "../../../../types.ts";
import { CartItem } from "./CartItem.tsx";
import { getAppliedDiscount } from "../utils";


interface Props {
  cart: TCartItem[];
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
}

// CartList component
export const CartList = ({ cart, updateQuantity, removeFromCart }: Props) => (
  <div className="space-y-2">
    {cart.map(item => (
      <CartItem
        key={item.product.id}
        item={item}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        appliedDiscount={getAppliedDiscount(item)}
      />
    ))}
  </div>
);
